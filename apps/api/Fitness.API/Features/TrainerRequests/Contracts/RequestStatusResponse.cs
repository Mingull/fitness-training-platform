namespace Fitness.API.Features.TrainerRequests.Contracts;

public record RequestStatusResponse
{
    public required string Value { get; set; }
    public required string Label { get; set; }
}