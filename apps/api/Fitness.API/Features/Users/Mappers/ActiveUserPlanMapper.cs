using Fitness.API.Features.Plans;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.Users.Contracts;

namespace Fitness.API.Features.Users.Mappers;

public static class ActiveUserPlanMapper
{
    public static ActiveUserPlanResponse ToResponse(this ActiveUserPlan entity)
    {
        return new ActiveUserPlanResponse
        {
            ActivatedAt = entity.ActivatedAt,
            Plan = entity.Plan.ToResponse()
        };
    }
}