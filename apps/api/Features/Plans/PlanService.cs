using Fitness.API.Core.Utilities;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Plans.Contracts;
using Fitness.API.Features.Profiles.Abstract;

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
        var plans = await planRepository.GetAllPlansAsync(userId);
        // Plans now include the CreatedBy -> AppUser -> Profile navigation

        var planResponses = new List<PlanResponse>();

        foreach (var plan in plans)
        {
            var creatorProfile = plan.CreatedBy?.Profile;
            planResponses.Add(new PlanResponse
            {
                Id = plan.Id,
                    Creator = new PlanCreator
                    {
                        Id = creatorProfile?.Id ?? Guid.Empty,
                        Username = plan.CreatedBy?.UserName ?? creatorProfile?.User?.UserName ?? "Unknown",
                        PictureUrl = creatorProfile?.PictureUrl
                    },
                Name = plan.Name,
                Description = plan.Description,
                EstimatedDuration = plan.EstimatedDuration,
                IsPublic = plan.IsPublic
            });
            continue;
        }

        return Result<IEnumerable<PlanResponse>>.Success(planResponses);
    }
}
