using Fitness.API.Features.Plans.Contracts;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.Workouts;

namespace Fitness.API.Features.Plans;

public static class PlanMappers
{
    public static PlanResponse ToResponse(this Plan plan)
    {
        var creatorProfile = plan.CreatedBy?.Profile;
        return new PlanResponse
        {
            Id = plan.Id,
            Creator = new()
            {
                Id = plan.CreatedBy?.Id ?? Guid.Empty,
                Username = plan.CreatedBy?.UserName ?? "Unknown",
                PictureUrl = creatorProfile?.PictureUrl
            },
            Name = plan.Name,
            Description = plan.Description,
            Difficulty = PlanDifficultyResponse.FromLevel(plan.DifficultyLevel),
            EstimatedDuration = plan.EstimatedDuration,
            IsPublic = plan.IsPublic,
            CreatedAt = plan.CreatedAt,
            UpdatedAt = plan.UpdatedAt,
            DeletedAt = plan.DeletedAt
        };
    }

    public static PlanDetailResponse ToDetailResponse(this Plan plan)
    {
        var creatorProfile = plan.CreatedBy?.Profile;
        return new PlanDetailResponse
        {
            Id = plan.Id,
            Creator = new()
            {
                Id = plan.CreatedBy?.Id ?? Guid.Empty,
                Username = plan.CreatedBy?.UserName ?? "Unknown",
                PictureUrl = creatorProfile?.PictureUrl
            },
            Name = plan.Name,
            Description = plan.Description,
            Difficulty = PlanDifficultyResponse.FromLevel(plan.DifficultyLevel),
            EstimatedDuration = plan.EstimatedDuration,
            IsPublic = plan.IsPublic,
            Workouts = [.. plan.Workouts.Select(w => w.ToResponse())],
            CreatedAt = plan.CreatedAt,
            UpdatedAt = plan.UpdatedAt,
            DeletedAt = plan.DeletedAt,
        };
    }
}