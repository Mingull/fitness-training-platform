using Fitness.API.Features.WorkoutExercises.Contracts;
using Fitness.API.Features.WorkoutExercises.Models;

namespace Fitness.API.Features.WorkoutExercises.Abstract;

public interface IWorkoutExerciseService
{
    Task LinkExerciseToWorkoutAsync(LinkExerciseRequest request);
    Task UpdateExerciseOrdersAsync(IEnumerable<WorkoutExercise> workoutExercises);
}