using Fitness.API.Features.Plans.Contracts;

namespace Fitness.API.Features.Users.Contracts;

public record ActiveUserPlanResponse
{
    public PlanResponse Plan { get; set; } = null!;
    public DateTime ActivatedAt { get; set; }
}