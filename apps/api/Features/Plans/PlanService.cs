using Fitness.API.Core.Utilities;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Plans.Contracts;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.Plans.Utilities;

namespace Fitness.API.Features.Plans;

public class PlanService(IPlanRepository planRepository) : IPlanService
{
    /// <summary>
    /// Gets all available plans, it does not matter if the user does not own a public plan.
    /// If any of the plans found is private and does not belong to the authenticated user, it will be filtered out from the results.
    /// </summary>
    public async Task<Result<IEnumerable<PlanResponse>>> GetAllPlansAsync(Guid userId)
    {
        // Get all plans from the repository
        var plans = await planRepository.GetAllPlansAsync();

        // Filter out private plans that do not belong to the authenticated user
        plans = plans.Where(plan => plan.IsPublic || plan.CreatedById == userId);

        // Map the remaining plans to PlanResponse DTOs
        var planResponses = plans.Select(plan => new PlanResponse
        {
            Id = plan.Id,
            Name = plan.Name,
            Description = plan.Description,
            EstimatedDuration = plan.EstimatedDuration,
            CreatedById = plan.CreatedById,
            IsPublic = plan.IsPublic
        }).ToList();

        return Result<IEnumerable<PlanResponse>>.Success(planResponses);
    }
}
