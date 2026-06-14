using Fitness.API.Core.Utilities;
using Fitness.API.Features.Exercises.Abstract;
using Fitness.API.Features.Exercises.Contracts;
using Fitness.API.Features.Exercises.Utilities;

namespace Fitness.API.Features.Exercises;

public class ExerciseService(IExerciseRepository exerciseRepository) : IExerciseService
{

    public async Task<Result<ExerciseResponse>> GetExerciseByIdAsync(Guid id)
    {
        var exercise = await exerciseRepository.GetByIdAsync(id);

        if (exercise is null)
            return ExerciseErrors.NotFound;

        return Result<ExerciseResponse>.Success(exercise.ToResponse());
    }

    public async Task<Result<IEnumerable<ExerciseResponse>>> GetAllExercisesAsync()
    {
        var exercises = await exerciseRepository.GetAllAsync();
        var responses = exercises.Select(e => e.ToResponse());

        return Result<IEnumerable<ExerciseResponse>>.Success(responses);
    }

    public async Task<Result<ExerciseResponse>> CreateExerciseAsync(CreateExerciseRequest request, Guid userId)
    {
        var exercise = await exerciseRepository.CreateAsync(new()
        {
            Name = request.Name,
            Description = request.Description,
            MediaUrl = request.MediaUrl,
            CreatedById = userId
        });

        return Result<ExerciseResponse>.Success(exercise.ToResponse());
    }
}