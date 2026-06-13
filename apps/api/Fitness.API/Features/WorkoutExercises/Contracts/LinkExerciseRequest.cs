namespace Fitness.API.Features.Workouts.Contracts;

public record LinkExerciseRequest
{
    public Guid WorkoutId { get; init; }
    public Guid ExerciseId { get; init; }
    public int ExerciseOrder { get; init; }
    public int Sets { get; init; }
    public int Reps { get; init; }
    public decimal Weight { get; init; }
}