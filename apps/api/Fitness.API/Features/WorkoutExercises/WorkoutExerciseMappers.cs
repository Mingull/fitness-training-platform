using Fitness.API.Features.Exercises.Contracts;
using Fitness.API.Features.Exercises;
using Fitness.API.Features.WorkoutExercises.Models;

namespace Fitness.API.Features.WorkoutExercises;

public static class WorkoutExerciseMappers
{
    public static ExerciseDetailResponse ToResponse(this WorkoutExercise workoutExercise)
    {
        return workoutExercise.Exercise.ToDetailResponse(workoutExercise);
    }
}