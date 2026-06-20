namespace Fitness.API.Features.TrainerRequests.Contracts;

// Need better name for this, as it is hard to read when it is request 2 times 
public record CreateTrainerRequestRequest
{
    public Guid TrainerId { get; set; }
    public string? Message { get; set; }
}
