using Fitness.API.Core.Utilities;
using Fitness.API.Features.Auth.Utilities;
using Fitness.API.Features.Exercises.Abstract;
using Fitness.API.Features.Exercises.Utilities;
using Fitness.API.Features.WorkoutExercises.Abstract;
using Fitness.API.Features.Workouts.Abstract;
using Fitness.API.Features.Workouts.Contracts;
using Fitness.API.Features.Workouts.Utilities;

namespace Fitness.API.Features.Workouts;

public class WorkoutService(IWorkoutRepository workoutRepository, IExerciseService exerciseService, IWorkoutExerciseService workoutExerciseService) : IWorkoutService
{
    public async Task<Result<WorkoutDetailResponse>> GetWorkoutByIdAsync(Guid id, Guid userId)
    {
        var workout = await workoutRepository.GetWorkoutByIdAsync(id);

        if (workout == null)
            return WorkoutErrors.NotFound;

        if (workout.Plan.CreatedById != userId)
            return AuthErrors.UnauthorizedWithResource("GetWorkoutById");

        return Result<WorkoutDetailResponse>.Success(workout.ToDetailResponse());
    }

    public async Task<Result<WorkoutResponse>> AddExerciseAsync(Guid workoutId, AddExerciseRequest request, Guid userId)
    {
        // check wheter exerciseId has been provided in the request or is an exercise object has been provided
        if (request.ExerciseId is null && request.Exercise is null)
            return WorkoutErrors.NoExerciseProvided; // we need either an exercise id or an exercise object to add an exercise to the workout

        var workout = await workoutRepository.GetWorkoutByIdAsync(workoutId);

        if (workout == null)
            return WorkoutErrors.NotFound;

        if (workout.Plan.CreatedById != userId)
            return AuthErrors.UnauthorizedWithResource("AddExerciseToWorkout");

        var nextOrder = workout.WorkoutExercises.Count == 0 ? 1 : workout.WorkoutExercises.Max(exercise => exercise.ExerciseOrder) + 1;

        // If exerciseId is provided, we need to get the exercise from the database, otherwise we will use the provided exercise object to create a new exercise
        var exercise = request.ExerciseId is not null
            ? await exerciseService.GetExerciseByIdAsync(request.ExerciseId.Value)
            : await exerciseService.CreateExerciseAsync(request.Exercise!, userId);

        if (!exercise.IsSuccess)
            return ExerciseErrors.NotFound;

        await workoutExerciseService.LinkExerciseToWorkoutAsync(new()
        {
            WorkoutId = workoutId,
            ExerciseId = exercise.Value.Id,
            ExerciseOrder = nextOrder,
            Sets = request.Sets,
            Reps = request.Reps,
            Weight = request.Weight
        });

        var updatedWorkout = await workoutRepository.GetWorkoutByIdAsync(workoutId);
        return Result<WorkoutResponse>.Success(updatedWorkout!.ToResponse());
    }
}