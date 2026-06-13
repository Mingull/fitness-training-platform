using Fitness.API.Features.Exercises.Models;

namespace Fitness.API.Features.Exercises.Abstract;

public interface IExerciseRepository
{
    Task<IEnumerable<Exercise>> GetAllAsync();
    Task<Exercise?> GetByIdAsync(Guid id);
    Task<Exercise> CreateAsync(Exercise exercise);
}