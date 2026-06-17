using Fitness.API.Core.Contexts;
using Fitness.API.Features.WorkoutExercises.Abstract;
using Fitness.API.Features.WorkoutExercises.Models;
using Fitness.API.Features.Workouts.Contracts;

namespace Fitness.API.Features.WorkoutExercises;

public class WorkoutExerciseRepository(FitnessContext context) : IWorkoutExerciseRepository
{
    public async Task<WorkoutExercise> LinkAsync(Guid workoutId, Guid exerciseId, int exerciseOrder, int sets, int reps, decimal weight)
    {
        var workoutExercise = new WorkoutExercise
        {
            Id = Guid.CreateVersion7(),
            WorkoutId = workoutId,
            ExerciseId = exerciseId,
            ExerciseOrder = exerciseOrder,
            Sets = sets,
            Reps = reps,
            Weight = weight
        };

        context.WorkoutExercises.Add(workoutExercise);
        await context.SaveChangesAsync();

        return workoutExercise;
    }

    public Task UpdateExerciseOrdersAsync(IEnumerable<WorkoutExercise> workoutExercises)
    {
        context.WorkoutExercises.UpdateRange(workoutExercises);
        return context.SaveChangesAsync();
    }
}