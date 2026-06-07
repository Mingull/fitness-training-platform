using Fitness.API.Core.Utilities;
using Fitness.API.Features.Plans.Contracts;
using Fitness.API.Features.Users.Contracts;

namespace Fitness.API.Features.Plans.Abstract;

public interface IPlanService
{
    /// <summary>
    /// Gets all available plans, it does not matter if the user does not own a public plan.
    /// <para>
    /// If any of the plans found is private and does not belong to the authenticated user, it will be filtered out from the results.
    /// </para>
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<Result<IEnumerable<PlanResponse>>> GetAllPlansAsync(Guid? userId);
    /// <summary>
    /// Gets an plan by its id. If the plan is private and does not belong to the authenticated user, it will return an error.
    /// </summary>
    /// <param name="planId"></param>
    /// <returns></returns>
    Task<Result<PlanResponse>> GetPlanByIdAsync(Guid planId, Guid? userId = null);
    /// <summary>
    /// Gets the active plan for the user.
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<Result<ActiveUserPlanResponse?>> GetActivePlanForUserAsync(Guid userId);
    /// <summary>
    /// Activates a plan for the user.
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="planId"></param>
    /// <returns></returns>
    Task<Result> ActivatePlanForUserAsync(Guid userId, Guid planId);
    /// <summary>
    /// Deactivates the active plan for the user, if any exists.
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    Task<Result> DeactivatePlanForUserAsync(Guid userId);
    Task<Result<PlanResponse>> CreatePlanAsync(CreatePlanRequest plan, Guid creatorId);
}