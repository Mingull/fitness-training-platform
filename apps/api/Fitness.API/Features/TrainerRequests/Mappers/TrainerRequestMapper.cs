using Fitness.API.Features.TrainerRequests.Contracts;
using Fitness.API.Features.TrainerRequests.Models;
using Fitness.API.Features.Users.Mappers;

namespace Fitness.API.Features.TrainerRequests.Mappers;

public static class TrainerRequestMapper
{
    public static TrainerRequestResponse ToResponse(this TrainerRequest entity)
    {
        return new TrainerRequestResponse
        {
            Id = entity.Id,
            Sporter = entity.Athlete.ToResponse(),
            Trainer = entity.Trainer.ToResponse(),
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