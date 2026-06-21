using Fitness.API.Features.TrainerRequests.Models;

namespace Fitness.API.Features.TrainerRequests.Abstract;

public interface ITrainerRequestRepository
{
    /// <summary>
    /// Creates a new trainer request in the database.
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    Task CreateAsync(TrainerRequest entity);
    /// <summary>
    /// Gets the status of a trainer request for a specific athlete and trainer.
    /// </summary>
    /// <param name="athleteId"></param>
    /// <param name="trainerId"></param>
    /// <returns></returns>
    Task<TrainerRequest?> GetRequestStatusAsync(Guid athleteId, Guid trainerId);
    /// <summary>
    /// Gets a trainer request by its ID.
    /// </summary>
    /// <param name="requestId"></param>
    /// <returns></returns>
    Task<TrainerRequest?> GetRequestByIdAsync(Guid requestId);
    /// <summary>
    /// Gets the active trainer relationship for a specific athlete.
    /// </summary>
    /// <param name="athleteId"></param>
    /// <returns></returns>
    Task<TrainerRelationship?> GetActiveRelationshipAsync(Guid athleteId);
    /// <summary>
    /// Gets all trainer requests for a specific trainer.
    /// </summary>
    /// <param name="trainerId"></param>
    /// <returns></returns>
    Task<IEnumerable<TrainerRequest>> GetAllRequestsForTrainerAsync(Guid trainerId);
    /// <summary>
    /// Gets all trainer requests for a specific athlete.
    /// </summary>
    /// <param name="athleteId"></param>
    /// <returns></returns>
    Task<IEnumerable<TrainerRequest>> GetAllRequestsForAthleteAsync(Guid athleteId);
    /// <summary>
    /// Rejects all pending trainer requests for a specific athlete except the specified request.
    /// </summary>
    /// <param name="athleteId"></param>
    /// <param name="exceptRequestId"></param>
    /// <returns></returns>
    Task RejectPendingRequestsForAthleteExceptAsync(Guid athleteId, Guid exceptRequestId);
    /// <summary>
    /// Updates an existing trainer request in the database.
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    Task UpdateRequestAsync(TrainerRequest request);
    /// <summary>
    /// Creates a new trainer relationship in the database.
    /// </summary>
    /// <param name="newRelation"></param>
    /// <returns></returns>
    Task<TrainerRelationship> CreateRelationAsync(TrainerRelationship newRelation);
    /// <summary>
    /// Updates an existing trainer relationship in the database.
    /// </summary>
    /// <param name="entity"></param>
    /// <returns></returns>
    Task UpdateRelationAsync(TrainerRelationship entity);
}