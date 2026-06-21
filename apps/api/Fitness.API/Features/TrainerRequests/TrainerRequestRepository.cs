using Fitness.API.Core.Contexts;
using Fitness.API.Features.TrainerRequests.Abstract;
using Fitness.API.Features.TrainerRequests.Contracts;
using Fitness.API.Features.TrainerRequests.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.TrainerRequests;

public class TrainerRequestRepository(FitnessContext context) : ITrainerRequestRepository
{
    public async Task CreateAsync(TrainerRequest entity)
    {
        entity.Id = Guid.CreateVersion7();
        entity.CreatedAt = DateTimeOffset.UtcNow;

        context.TrainerRequests.Add(entity);
        await context.SaveChangesAsync();
    }

    public async Task<TrainerRelationship?> GetActiveRelationshipAsync(Guid athleteId)
    {
        return await context.TrainerRelationships
            .Where(r => r.AthleteId == athleteId && r.EndDate == null)
            .FirstOrDefaultAsync();
    }

    public async Task<TrainerRequest?> GetRequestStatusAsync(Guid athleteId, Guid trainerId)
    {
        return await context.TrainerRequests
            .Include(r => r.Status)
            .Where(r => r.AthleteId == athleteId && r.TrainerId == trainerId)
            .FirstOrDefaultAsync();
    }

    public async Task<TrainerRequest?> GetRequestByIdAsync(Guid requestId)
    {
        return await context.TrainerRequests
            .Include(r => r.Status)
            .Include(r => r.Trainer) // Include trainer for notification purposes
            .Include(r => r.Athlete) // Include athlete for notification purposes
            .Where(r => r.Id == requestId)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<TrainerRequest>> GetAllRequestsForTrainerAsync(Guid trainerId)
    {
        return await context.TrainerRequests
            .Include(r => r.Status)
            .Include(r => r.Trainer) // Include trainer
                .ThenInclude(t => t.Profile) // Include trainer profile
            .Include(r => r.Athlete) // Include athlete 
                .ThenInclude(t => t.Profile) // Include athlete profile
            .Where(r => r.TrainerId == trainerId && r.StatusId == RequestStatuses.Pending.Id)
            .ToListAsync();
    }
    public async Task<IEnumerable<TrainerRequest>> GetAllRequestsForAthleteAsync(Guid athleteId)
    {
        return await context.TrainerRequests
            .Include(r => r.Status)
            .Where(r => r.AthleteId == athleteId)
            .ToListAsync();
    }

    public async Task RejectPendingRequestsForAthleteExceptAsync(Guid athleteId, Guid exceptRequestId)
    {
        var pendingRequests = await context.TrainerRequests
            .Where(r => r.AthleteId == athleteId && r.StatusId == RequestStatuses.Pending.Id && r.Id != exceptRequestId)
            .ToListAsync();

        foreach (var request in pendingRequests)
        {
            request.StatusId = RequestStatuses.Rejected.Id;
            request.UpdatedAt = DateTimeOffset.UtcNow;
        }

        context.TrainerRequests.UpdateRange(pendingRequests);
        await context.SaveChangesAsync();
    }

    public async Task UpdateRequestAsync(TrainerRequest entity)
    {
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        context.TrainerRequests.Update(entity);
        await context.SaveChangesAsync();
    }

    public async Task<TrainerRelationship> CreateRelationAsync(TrainerRelationship newRelation)
    {
        newRelation.Id = Guid.CreateVersion7();

        context.TrainerRelationships.Add(newRelation);
        await context.SaveChangesAsync();

        return newRelation;
    }

    public async Task UpdateRelationAsync(TrainerRelationship entity)
    {
        context.TrainerRelationships.Update(entity);
        await context.SaveChangesAsync();
    }
}