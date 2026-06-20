namespace Fitness.API.Features.TrainerRequests.Contracts;

public record RequestTrainerRequest
{
    public Guid TrainerId { get; set; }
    public string? Message { get; set; }
}
