using Fitness.API.Features.Exercises.Contracts;

namespace Fitness.API.Features.Workouts.Contracts;

public record WorkoutDetailResponse
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public ICollection<ExerciseResponse> Exercises { get; set; } = [];
}
