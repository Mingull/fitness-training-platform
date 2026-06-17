using Fitness.API.Features.WorkoutExercises.Models;
using Fitness.API.Features.Workouts.Contracts;

namespace Fitness.API.Features.WorkoutExercises.Abstract;

public interface IWorkoutExerciseRepository
{
    Task<WorkoutExercise> LinkAsync(Guid workoutId, Guid exerciseId, int exerciseOrder, int sets, int reps, decimal weight);
    Task UpdateExerciseOrdersAsync(IEnumerable<WorkoutExercise> workoutExercises);
}