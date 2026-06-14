using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.Workouts.Models;

namespace Fitness.API.Features.Plans.Abstract;

public interface IPlanRepository
{
    /// <summary>
    /// Gets all available plans, it does not matter if the user does not own a public plan.
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<IEnumerable<Plan>> GetAllAsync(Guid? userId);
    /// <summary>
    /// Gets an plan by its id.
    /// </summary>
    /// <param name="planId"></param>
    /// <returns></returns>
    Task<Plan?> GetByIdAsync(Guid planId, bool withWorkouts = false);
    /// <summary>
    /// Gets the active plan for the user. If the user does not have an active plan, it will return null.
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<ActiveUserPlan?> GetActivePlanForUserAsync(Guid userId);
    /// <summary>
    /// Activates a plan for the user. If the user already has an active plan, it will be deactivated before activating the new one.
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="planId"></param>
    /// <returns></returns>
    Task<bool> ActivatePlanForUserAsync(Guid userId, Guid planId);
    /// <summary>
    /// Deactivates the active plan for the user, if any exists.
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<bool> DeactivatePlanForUserAsync(Guid userId);
    /// <summary>
    /// Creates a new plan in the database.
    /// </summary>
    /// <param name="plan">The plan entity to create.</param>
    /// <returns>The created plan.</returns>
    Task<Plan> CreatePlanAsync(Plan plan);
    Task AddWorkoutAsync(Guid planId, Workout workout);
}