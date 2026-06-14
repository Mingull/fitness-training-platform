using Fitness.API.Features.Workouts.Models;

namespace Fitness.API.Features.Workouts.Abstract;

public interface IWorkoutRepository
{
    Task<Workout?> GetWorkoutByIdAsync(Guid workoutId);
}