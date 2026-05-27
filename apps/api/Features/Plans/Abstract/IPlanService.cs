using Fitness.API.Core.Utilities;
using Fitness.API.Features.Plans.Contracts;

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
    Task<Result<IEnumerable<PlanResponse>>> GetAllPlansAsync(Guid userId);
}