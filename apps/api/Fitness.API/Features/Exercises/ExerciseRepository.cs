using Fitness.API.Core.Contexts;
using Fitness.API.Features.Exercises.Abstract;
using Fitness.API.Features.Exercises.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Exercises;

public class ExerciseRepository(FitnessContext context) : IExerciseRepository
{
    public async Task<Exercise?> GetByIdAsync(Guid id)
    {
        return await context.Exercises.FindAsync(id);
    }

    public async Task<IEnumerable<Exercise>> GetAllAsync()
    {
        return await context.Exercises.ToListAsync();
    }

    public async Task<Exercise> CreateAsync(Exercise exercise)
    {
        exercise.Id = Guid.CreateVersion7();
        exercise.CreatedAt = DateTime.UtcNow;
        context.Exercises.Add(exercise);
        await context.SaveChangesAsync();
        return exercise;
    }
}