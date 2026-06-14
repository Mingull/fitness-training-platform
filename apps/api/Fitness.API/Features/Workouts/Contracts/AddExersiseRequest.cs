using Fitness.API.Features.Exercises.Contracts;

namespace Fitness.API.Features.Workouts.Contracts;

public record AddExerciseRequest
{
    public Guid? ExerciseId { get; init; }
    public CreateExerciseRequest? Exercise { get; init; }
    public int Sets { get; init; }
    public int Reps { get; init; }
    public decimal Weight { get; init; }
}