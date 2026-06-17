using Fitness.API.Features.WorkoutExercises.Abstract;
using Fitness.API.Features.WorkoutExercises.Contracts;
using Fitness.API.Features.WorkoutExercises.Models;

namespace Fitness.API.Features.WorkoutExercises;

public class WorkoutExerciseService(IWorkoutExerciseRepository workoutExerciseRepository) : IWorkoutExerciseService
{
    public Task LinkExerciseToWorkoutAsync(LinkExerciseRequest request)
    {
        return workoutExerciseRepository.LinkAsync(request.WorkoutId, request.ExerciseId, request.ExerciseOrder, request.Sets, request.Reps, request.Weight);
    }

    public Task UpdateExerciseOrdersAsync(IEnumerable<WorkoutExercise> workoutExercises)
    {
        return workoutExerciseRepository.UpdateExerciseOrdersAsync(workoutExercises);
    }
}