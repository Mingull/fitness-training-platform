using Fitness.API.Core.Utilities;

namespace Fitness.API.Features.Exercises.Utilities;

public static class ExerciseErrors
{
    public static ApiError NotFound { get; } = new("NoExerciseFound", ErrorType.NotFound, "Exercise not found", "The requested exercise was not found.");
}