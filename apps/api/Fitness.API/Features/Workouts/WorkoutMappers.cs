using Fitness.API.Features.Exercises;
using Fitness.API.Features.WorkoutExercises;
using Fitness.API.Features.Workouts.Contracts;
using Fitness.API.Features.Workouts.Models;

namespace Fitness.API.Features.Workouts;

public static class WorkoutMappers
{
    public static WorkoutResponse ToResponse(this Workout workout)
    {
        return new WorkoutResponse
        {
            Id = workout.Id,
            Name = workout.Name,
            Order = workout.Order,
            CreatedAt = workout.CreatedAt,
            UpdatedAt = workout.UpdatedAt,
            DeletedAt = workout.DeletedAt,
        };
    }
    public static WorkoutDetailResponse ToDetailResponse(this Workout workout)
    {
        return new WorkoutDetailResponse
        {
            Id = workout.Id,
            Name = workout.Name,
            CreatedAt = workout.CreatedAt,
            UpdatedAt = workout.UpdatedAt,
            DeletedAt = workout.DeletedAt,
            Exercises = [.. workout.WorkoutExercises
                .OrderBy(we => we.ExerciseOrder)
                .Select(we => we.ToResponse())]
        };
    }
}