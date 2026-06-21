using Fitness.API.Core.Utilities;
using Fitness.API.Features.TrainerRequests.Contracts;

namespace Fitness.API.Features.TrainerRequests.Abstract;

public interface ITrainerRequestService
{
    Task<Result<TrainerRequestResponse>> CreateRequestAsync(Guid athleteId, RequestTrainerRequest request);
    Task<Result> AcceptRequestAsync(Guid trainerId, Guid requestId);
    Task<Result> RejectRequestAsync(Guid trainerId, Guid requestId);
    Task<Result<TrainerRequestResponse>> GetRequestStatusAsync(Guid userId, Guid requestId);
    Task<Result<IEnumerable<TrainerRequestResponse>>> GetAllRequestsForTrainerAsync(Guid trainerId);
}