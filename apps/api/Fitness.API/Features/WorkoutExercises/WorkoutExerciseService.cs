using Fitness.API.Features.WorkoutExercises.Abstract;
using Fitness.API.Features.Workouts.Contracts;

namespace Fitness.API.Features.WorkoutExercises;

public class WorkoutExerciseService(IWorkoutExerciseRepository workoutExerciseRepository) : IWorkoutExerciseService
{
    public Task LinkExerciseToWorkoutAsync(LinkExerciseRequest request)
    {
        return workoutExerciseRepository.LinkAsync(request.WorkoutId, request.ExerciseId, request.ExerciseOrder, request.Sets, request.Reps, request.Weight);
    }
}