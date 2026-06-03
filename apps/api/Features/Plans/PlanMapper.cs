using Fitness.API.Features.Plans.Contracts;
using Fitness.API.Features.Plans.Models;

namespace Fitness.API.Features.Plans;

public static class PlanMappings
{
    public static PlanResponse ToResponse(this Plan plan)
    {
        var creatorProfile = plan.CreatedBy?.Profile;
        return new PlanResponse
        {
            Id = plan.Id,
            Creator = new PlanCreatorResponse
            {
                Id = plan.CreatedBy?.Id ?? Guid.Empty,
                Username = plan.CreatedBy?.UserName ?? "Unknown",
                PictureUrl = creatorProfile?.PictureUrl
            },
            Name = plan.Name,
            Description = plan.Description,
            Difficulty = plan.Difficulty,
            EstimatedDuration = plan.EstimatedDuration,
            IsPublic = plan.IsPublic,
            CreatedAt = plan.CreatedAt,
            UpdatedAt = plan.UpdatedAt
        };
    }
}