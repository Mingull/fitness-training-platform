namespace Fitness.API.Features.TrainerRequests.Contracts;

public record TrainerRequestResponse
{
    public Guid Id { get; set; }
    public Guid SporterId { get; set; }
    public Guid TrainerId { get; set; }
    public RequestStatusResponse Status { get; set; } = null!;
    public string? Message { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
}