using Fitness.API.Features.Workouts.Contracts;

namespace Fitness.API.Features.WorkoutExercises.Abstract;

public interface IWorkoutExerciseService
{
    Task LinkExerciseToWorkoutAsync(LinkExerciseRequest request);
}