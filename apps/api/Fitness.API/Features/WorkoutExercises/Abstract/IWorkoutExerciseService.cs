using Fitness.API.Features.WorkoutExercises.Contracts;

namespace Fitness.API.Features.WorkoutExercises.Abstract;

public interface IWorkoutExerciseService
{
    Task LinkExerciseToWorkoutAsync(LinkExerciseRequest request);
}