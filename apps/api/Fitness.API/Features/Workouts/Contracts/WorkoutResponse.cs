namespace Fitness.API.Features.Workouts.Contracts;

public record WorkoutResponse
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required int Order { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
}
