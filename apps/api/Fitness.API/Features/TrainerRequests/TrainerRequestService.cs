using Fitness.API.Core.Contexts;
using Fitness.API.Core.Utilities;
using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Notifications.Abstract;
using Fitness.API.Features.Notifications.Models;
using Fitness.API.Features.TrainerRequests.Abstract;
using Fitness.API.Features.TrainerRequests.Contracts;
using Fitness.API.Features.TrainerRequests.Mappers;
using Fitness.API.Features.TrainerRequests.Models;
using Fitness.API.Features.TrainerRequests.Utilities;
using Microsoft.AspNetCore.Identity;

namespace Fitness.API.Features.TrainerRequests;

public class TrainerRequestService(
    ITrainerRequestRepository trainerRequestRepository,
    UserManager<AppUser> userManager,
    INotificationService notificationService,
    FitnessContext context,
    ILogger<TrainerRequestService> logger) : ITrainerRequestService
{
    public async Task<Result<TrainerRequestResponse>> GetRequestStatusAsync(Guid userId, Guid requestId)
    {
        var request = await trainerRequestRepository.GetRequestStatusAsync(userId, requestId);

        if (request is null)
            return TrainerRequestErrors.RequestNotFound;

        return Result<TrainerRequestResponse>.Success(request.ToResponse());
    }

    public async Task<Result<IEnumerable<TrainerRequestResponse>>> GetAllRequestsForTrainerAsync(Guid trainerId)
    {
        var trainer = await userManager.FindByIdAsync(trainerId.ToString());
        if (trainer is null)
            return TrainerRequestErrors.TrainerNotFound;

        if (!await userManager.IsInRoleAsync(trainer, Roles.Trainer))
            return TrainerRequestErrors.AuthUserNotTrainer;

        var requests = await trainerRequestRepository.GetAllRequestsForTrainerAsync(trainerId);

        var trainerRequestResponses = new List<TrainerRequestResponse>();

        foreach (var request in requests)
        {
            trainerRequestResponses.Add(request.ToResponse());
            continue;
        }

        return Result<IEnumerable<TrainerRequestResponse>>.Success(trainerRequestResponses);
    }

    public async Task<Result<TrainerRequestResponse>> CreateRequestAsync(Guid athleteId, RequestTrainerRequest request)
    {
        // STEP 1: VALIDATE INPUT
        if (athleteId == request.TrainerId)
            return TrainerRequestErrors.RequestSentToSelf;

        var athlete = await userManager.FindByIdAsync(athleteId.ToString());
        if (athlete is null)
            return TrainerRequestErrors.AthleteNotFound;

        // check if user has Sporter role, if not return forbidden (403) instead of not found (404) to prevent user enumeration
        if (!await userManager.IsInRoleAsync(athlete, Roles.Sporter))
            return TrainerRequestErrors.AthleteNotSporter;

        var trainer = await userManager.FindByIdAsync(request.TrainerId.ToString());
        if (trainer is null)
            return TrainerRequestErrors.TrainerNotFound;

        if (!await userManager.IsInRoleAsync(trainer, Roles.Trainer))
            return TrainerRequestErrors.SelectedUserNotTrainer;

        // STEP 2: CHECK EXISTING REQUEST
        var existingRequest = await trainerRequestRepository.GetRequestStatusAsync(athleteId, request.TrainerId);

        if (existingRequest != null)
            return TrainerRequestErrors.RequestAlreadyExists;

        // STEP 3: CHECK ACTIVE RELATIONSHIP
        var activeRelation = await trainerRequestRepository.GetActiveRelationshipAsync(athleteId);

        if (activeRelation != null)
            return TrainerRequestErrors.ActiveTrainerExists;

        // STEP 4: CREATE REQUEST  
        var newRequest = new TrainerRequest
        {
            AthleteId = athleteId,
            TrainerId = request.TrainerId,
            StatusId = RequestStatuses.Pending.Id,
            Message = request.Message,
        };

        await trainerRequestRepository.CreateAsync(newRequest);

        // STEP 4.1: Refresh the newRequest entity to include the navigation properties (Athlete and Trainer)
        newRequest = (await trainerRequestRepository.GetRequestStatusAsync(athleteId, request.TrainerId))!;

        // STEP 5: NOTIFICATION (async side effect)
        await notificationService.SendAsync(trainer.Id, "New Trainer Request", $"You have received a new trainer request from {athlete.UserName}.", NotificationType.TrainerRequest, new()
        {
            { "AthleteId", athlete.Id },
            { "TrainerRequestId", newRequest.Id },
            { "Message", request.Message ?? string.Empty }
        });

        // STEP 6: RETURN RESPONSE
        return Result<TrainerRequestResponse>.Success(newRequest.ToResponse());
    }

    public async Task<Result> AcceptRequestAsync(Guid trainerId, Guid requestId)
    {
        // Step 1: Get request
        // - Check if exists
        // - Check if request.TrainerId == trainerId (authorization)
        var request = await trainerRequestRepository.GetRequestByIdAsync(requestId);
        logger.LogInformation("Accepting request {RequestId} for trainer {TrainerId}", requestId, trainerId);
        if (request is null)
            return TrainerRequestErrors.RequestNotFound;

        if (request.TrainerId != trainerId)
            return TrainerRequestErrors.AuthUserNotTrainer;

        // Step 2: Validate state
        // - Request must be Pending
        if (request.StatusId != RequestStatuses.Pending.Id)
            return TrainerRequestErrors.InvalidRequestState("accepted");

        // step 3: start transaction (to ensure data consistency in case of errors during the process)
        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            var now = DateTime.UtcNow;
            // Step 4: Check existing active relationship
            // - If athlete already has active relationship:
            //     → close it (EndDate = now)
            var activeRelation = await trainerRequestRepository.GetActiveRelationshipAsync(request.AthleteId);
            if (activeRelation is not null)
            {
                activeRelation.EndDate = now;
                await trainerRequestRepository.UpdateRelationAsync(activeRelation);
            }

            // Step 5: Update request status → Accepted
            request.StatusId = RequestStatuses.Accepted.Id;
            await trainerRequestRepository.UpdateRequestAsync(request);

            // Step 6: Create new TrainerRelationship
            await trainerRequestRepository.CreateRelationAsync(new TrainerRelationship
            {
                AthleteId = request.AthleteId,
                TrainerId = request.TrainerId,
                StartDate = now,
                EndDate = null
            });

            // Step 7: Reject all other pending requests for this athlete
            await trainerRequestRepository.RejectPendingRequestsForAthleteExceptAsync(request.AthleteId, request.Id);

            // Step 8: Commit transaction 
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to accept trainer request {RequestId} for trainer {TrainerId}", requestId, trainerId);
            await transaction.RollbackAsync();
            return TrainerRequestErrors.SomethingWentWrong;
        }

        // Step 9: Send notification to athlete (accepted)
        // This is a side effect and should not invalidate a successfully committed transaction.
        try
        {
            await notificationService.SendAsync(request.AthleteId, "Trainer Request Accepted", $"Your trainer request to {request.Trainer.UserName} has been accepted.", NotificationType.TrainerRequestAccepted, new()
            {
                { "TrainerId", request.TrainerId },
                { "TrainerRequestId", request.Id }
            });
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Trainer request {RequestId} accepted, but notification could not be sent to athlete {AthleteId}", requestId, request.AthleteId);
        }

        // Step 10: return success
        return Result.Success();
    }

    public async Task<Result> RejectRequestAsync(Guid trainerId, Guid requestId)
    {
        // Step 1: Get request
        // - Check exists
        // - Check ownership (trainerId == trainerId)
        var request = await trainerRequestRepository.GetRequestByIdAsync(requestId);
        if (request is null)
            return TrainerRequestErrors.RequestNotFound;

        if (request.TrainerId != trainerId)
            return TrainerRequestErrors.AuthUserNotTrainer;

        // Step 2: Validate state
        // - Must be Pending
        if (request.StatusId != RequestStatuses.Pending.Id)
            return TrainerRequestErrors.InvalidRequestState("rejected");

        // Step 3: Update status → Rejected
        request.StatusId = RequestStatuses.Rejected.Id;
        await trainerRequestRepository.UpdateRequestAsync(request);

        // Step 4: Send notification (optional but recommended)
        await notificationService.SendAsync(request.AthleteId, "Trainer Request Rejected", $"Your trainer request to {request.Trainer.UserName} has been rejected.", NotificationType.TrainerRequestRejected, new()
        {
            { "TrainerId", request.TrainerId },
            { "TrainerRequestId", request.Id }
        });

        // Step 5: Return success
        return Result.Success();
    }
}