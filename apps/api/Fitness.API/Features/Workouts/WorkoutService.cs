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
    public async Task<Result<WorkoutDetailResponse>> GetWorkoutByIdAsync(Guid id, Guid? userId)
    {
        var workout = await workoutRepository.GetWorkoutByIdAsync(id);

        if (workout == null)
            return WorkoutErrors.NotFound;

        // If the parent plan is private and the user is not the owner, return not found
        if (!workout.Plan.IsPublic && workout.Plan.CreatedById != userId)
        {
            return WorkoutErrors.NotFound; // Return not found to avoid exposing the existence of the plan
        }

        return Result<WorkoutDetailResponse>.Success(workout.ToDetailResponse());
    }

    public async Task<Result<WorkoutDetailResponse>> AddExerciseAsync(Guid workoutId, AddExerciseRequest request, Guid userId)
    {
        // Check whether an ExerciseId was provided, or an Exercise object was provided.
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
        return Result<WorkoutDetailResponse>.Success(updatedWorkout!.ToDetailResponse());
    }

    public async Task<Result<WorkoutDetailResponse>> ReorderExercisesAsync(Guid workoutId, IEnumerable<ReorderExerciseRequest> request, Guid userId)
    {
        var workout = await workoutRepository.GetWorkoutByIdAsync(workoutId);

        if (workout == null)
            return WorkoutErrors.NotFound;

        if (workout.Plan.CreatedById != userId)
            return AuthErrors.UnauthorizedWithResource("ReorderExercisesInWorkout");

        var reorderRequests = request.ToList();
        var existingWorkoutExercises = workout.WorkoutExercises.ToList();
        var exerciseCount = existingWorkoutExercises.Count;

        if (exerciseCount <= 1)
            return Result<WorkoutDetailResponse>.Success(workout.ToDetailResponse());

        if (reorderRequests.Count != exerciseCount)
            return WorkoutErrors.InvalidExerciseReorderRequest("The reorder request must contain every exercise exactly once.");

        var duplicateExerciseId = reorderRequests
            .GroupBy(item => item.ExerciseId)
            .FirstOrDefault(group => group.Count() > 1)?.Key;

        if (duplicateExerciseId.HasValue)
            return WorkoutErrors.InvalidExerciseReorderRequest($"The exercise with ID {duplicateExerciseId.Value} appears more than once in the reorder request.");

        var existingExerciseIds = existingWorkoutExercises.Select(we => we.ExerciseId).ToHashSet();
        var unknownExerciseId = reorderRequests
            .Select(item => item.ExerciseId)
            .FirstOrDefault(exerciseId => !existingExerciseIds.Contains(exerciseId));

        if (unknownExerciseId != Guid.Empty)
            return WorkoutErrors.ExerciseNotInWorkout(unknownExerciseId);

        var requestedIndexes = reorderRequests.Select(item => item.NewOrderIndex).ToList();
        var usesZeroBasedIndexes = requestedIndexes.Min() == 0 && requestedIndexes.Max() == exerciseCount - 1;
        var usesOneBasedIndexes = requestedIndexes.Min() == 1 && requestedIndexes.Max() == exerciseCount;

        if (!usesZeroBasedIndexes && !usesOneBasedIndexes)
            return WorkoutErrors.InvalidExerciseReorderRequest("Order indexes must be either 0..N-1 or 1..N.");

        if (requestedIndexes.Distinct().Count() != exerciseCount)
            return WorkoutErrors.InvalidExerciseReorderRequest("Order indexes must be unique.");

        // Normalize to 1-based and apply the new order
        foreach (var reorderRequest in reorderRequests)
        {
            var workoutExercise = existingWorkoutExercises.First(we => we.ExerciseId == reorderRequest.ExerciseId);
            workoutExercise.ExerciseOrder = usesZeroBasedIndexes ? reorderRequest.NewOrderIndex + 1 : reorderRequest.NewOrderIndex;
        }

        try
        {
            await workoutExerciseService.UpdateExerciseOrdersAsync(existingWorkoutExercises);
        }
        catch
        {
            return WorkoutErrors.ReorderExercisesFailed;
        }

        var updatedWorkout = await workoutRepository.GetWorkoutByIdAsync(workoutId);
        return Result<WorkoutDetailResponse>.Success(updatedWorkout!.ToDetailResponse());
    }
}