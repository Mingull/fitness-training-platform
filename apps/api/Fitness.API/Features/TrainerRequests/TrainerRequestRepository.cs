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

    public async Task<TrainerRequest?> GetPendingRequestAsync(Guid athleteId, Guid trainerId)
    {
        return await context.TrainerRequests
            .Include(r => r.Status)
            .Where(r => r.AthleteId == athleteId && r.TrainerId == trainerId && r.StatusId == RequestStatuses.Pending.Id)
            .FirstOrDefaultAsync();
    }
}