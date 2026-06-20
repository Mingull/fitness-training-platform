using Fitness.API.Features.Plans;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.TrainerRequests.Contracts;
using Fitness.API.Features.TrainerRequests.Models;
using Fitness.API.Features.Users.Contracts;

namespace Fitness.API.Features.TrainerRequests.Mappers;

public static class TrainerRequestMapper
{
    public static TrainerRequestResponse ToResponse(this TrainerRequest entity)
    {
        return new TrainerRequestResponse
        {
            Id = entity.Id,
            SporterId = entity.AthleteId,
            TrainerId = entity.TrainerId,
            Status = new()
            {
                Label = entity.Status.Label,
                Value = entity.Status.Value
            },
            Message = entity.Message,
            CreatedAt = entity.CreatedAt
        };
    }
}