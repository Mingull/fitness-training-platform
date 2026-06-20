using Fitness.API.Features.TrainerRequests.Models;

namespace Fitness.API.Features.TrainerRequests.Abstract;

public interface ITrainerRequestRepository
{
    Task CreateAsync(TrainerRequest entity);
    Task<TrainerRequest?> GetPendingRequestAsync(Guid athleteId, Guid trainerId);
    Task<TrainerRelationship?> GetActiveRelationshipAsync(Guid athleteId);
}