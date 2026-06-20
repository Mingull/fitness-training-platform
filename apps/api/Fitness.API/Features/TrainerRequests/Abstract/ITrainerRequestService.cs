using Fitness.API.Core.Utilities;
using Fitness.API.Features.TrainerRequests.Contracts;

namespace Fitness.API.Features.TrainerRequests.Abstract;

public interface ITrainerRequestService
{
    Task<Result<TrainerRequestResponse>> CreateRequestAsync(Guid athleteId, CreateTrainerRequestRequest request);
}