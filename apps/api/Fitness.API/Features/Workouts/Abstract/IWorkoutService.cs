using Fitness.API.Core.Utilities;
using Fitness.API.Features.Workouts.Contracts;

namespace Fitness.API.Features.Workouts.Abstract;

public interface IWorkoutService
{
    Task<Result<WorkoutDetailResponse>> GetWorkoutByIdAsync(Guid id, Guid? userId);
    Task<Result<WorkoutDetailResponse>> AddExerciseAsync(Guid workoutId, AddExerciseRequest request, Guid userId);
    Task<Result<WorkoutDetailResponse>> ReorderExercisesAsync(Guid workoutId, IEnumerable<ReorderExerciseRequest> request, Guid userId);
}