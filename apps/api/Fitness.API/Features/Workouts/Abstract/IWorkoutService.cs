using Fitness.API.Core.Utilities;
using Fitness.API.Features.Workouts.Contracts;

namespace Fitness.API.Features.Workouts.Abstract;

public interface IWorkoutService
{
    Task<Result<WorkoutDetailResponse>> GetWorkoutByIdAsync(Guid id, Guid userId);
    Task<Result<WorkoutResponse>> AddExerciseAsync(Guid workoutId, AddExerciseRequest request, Guid userId);
}