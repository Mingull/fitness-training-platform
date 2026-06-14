using Fitness.API.Core.Contexts;
using Fitness.API.Features.Workouts.Abstract;
using Fitness.API.Features.Workouts.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Workouts;

public class WorkoutRepository(FitnessContext context) : IWorkoutRepository
{
    public async Task<Workout?> GetWorkoutByIdAsync(Guid workoutId)
    {
        return await context.Workouts
            .Include(w => w.Plan)
            .Include(w => w.WorkoutExercises)
            .ThenInclude(we => we.Exercise)
            .Where(w => w.Id == workoutId)
            .FirstOrDefaultAsync();
    }
}