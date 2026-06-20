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

public class TrainerRequestService(ITrainerRequestRepository trainerRequestRepository, UserManager<AppUser> userManager, INotificationService notificationService) : ITrainerRequestService
{
    public async Task<Result<TrainerRequestResponse>> CreateRequestAsync(Guid athleteId, CreateTrainerRequestRequest request)
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
        var existingRequest = await trainerRequestRepository.GetPendingRequestAsync(athleteId, request.TrainerId);

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
        newRequest = (await trainerRequestRepository.GetPendingRequestAsync(athleteId, request.TrainerId))!;

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
}