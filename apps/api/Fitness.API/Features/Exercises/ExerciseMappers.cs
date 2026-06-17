using Fitness.API.Features.Exercises.Models;
using Fitness.API.Features.Exercises.Contracts;
using Fitness.API.Features.WorkoutExercises.Models;

namespace Fitness.API.Features.Exercises;

public static class ExerciseMappers
{
    public static ExerciseResponse ToResponse(this Exercise exercise)
    {
        return new ExerciseResponse
        {
            Id = exercise.Id,
            Name = exercise.Name,
            Description = exercise.Description,
            MediaUrl = exercise.MediaUrl,
            CreatedAt = exercise.CreatedAt,
            UpdatedAt = exercise.UpdatedAt,
            DeletedAt = exercise.DeletedAt
        };
    }
    
    public static ExerciseDetailResponse ToDetailResponse(this Exercise exercise, WorkoutExercise? workoutExercise = null)
    {
        return new ExerciseDetailResponse
        {
            Id = exercise.Id,
            Name = exercise.Name,
            Description = exercise.Description,
            Sets = workoutExercise?.Sets ?? 0,
            Reps = workoutExercise?.Reps ?? 0,
            Weight = workoutExercise?.Weight ?? 0,
            Order = workoutExercise?.ExerciseOrder ?? 0,
            MediaUrl = exercise.MediaUrl,
            CreatedAt = exercise.CreatedAt,
            UpdatedAt = exercise.UpdatedAt,
            DeletedAt = exercise.DeletedAt
        };
    }
}