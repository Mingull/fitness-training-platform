using Fitness.API.Core.Utilities;

namespace Fitness.API.Features.Workouts.Utilities;

public static class WorkoutErrors
{
    public static ApiError NotFound { get; } = new("NoWorkoutFound", ErrorType.NotFound, "Workout not found", "The requested workout was not found.");
    public static ApiError NoExerciseProvided { get; } = new("NoExerciseProvided", ErrorType.BadRequest, "No exercise provided", "Either an exercise ID or an exercise object must be provided to add an exercise to the workout.");
}