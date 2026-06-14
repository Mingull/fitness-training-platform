using Fitness.API.Core.Utilities;
using Fitness.API.Features.Exercises.Contracts;

namespace Fitness.API.Features.Exercises.Abstract;

public interface IExerciseService
{
    Task<Result<ExerciseResponse>> GetExerciseByIdAsync(Guid id);
    Task<Result<IEnumerable<ExerciseResponse>>> GetAllExercisesAsync();
    Task<Result<ExerciseResponse>> CreateExerciseAsync(CreateExerciseRequest request, Guid userId);
}