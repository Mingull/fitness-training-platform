using Fitness.API.Features.Exercises.Contracts;

namespace Fitness.API.Features.Workouts.Contracts;

public record WorkoutDetailResponse
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
    public ICollection<ExerciseDetailResponse> Exercises { get; set; } = [];
}
