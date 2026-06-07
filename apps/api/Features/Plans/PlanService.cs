using Fitness.API.Core.Utilities;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Plans.Contracts;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.Plans.Utilities;
using Fitness.API.Features.Users;
using Fitness.API.Features.Users.Contracts;

namespace Fitness.API.Features.Plans;

public class PlanService(IPlanRepository planRepository) : IPlanService
{
    public async Task<Result<IEnumerable<PlanResponse>>> GetAllPlansAsync(Guid? userId)
    {
        // Get all plans from the repository
        var plans = await planRepository.GetAllPlansAsync(userId);

        // Plans now include the CreatedBy -> AppUser -> Profile navigation
        var planResponses = new List<PlanResponse>();

        foreach (var plan in plans)
        {
            planResponses.Add(plan.ToResponse());
            continue;
        }

        return Result<IEnumerable<PlanResponse>>.Success(planResponses);
    }

    public async Task<Result<PlanResponse>> GetPlanByIdAsync(Guid planId, Guid? userId = null)
    {
        var plan = await planRepository.GetPlanByIdAsync(planId);

        if (plan == null)
        {
            return PlanErrors.NotFound;
        }

        // If the plan is private and the user is not the owner, return an error
        if (!plan.IsPublic && plan.CreatedById != userId)
        {
            return PlanErrors.NotFound; // Return not found to avoid exposing the existence of the plan
        }

        return Result<PlanResponse>.Success(plan.ToResponse());
    }

    public async Task<Result<ActiveUserPlanResponse?>> GetActivePlanForUserAsync(Guid userId)
    {
        var activePlan = await planRepository.GetActivePlanForUserAsync(userId);

        return Result<ActiveUserPlanResponse?>.Success(activePlan?.ToResponse());
    }

    public async Task<Result> ActivatePlanForUserAsync(Guid userId, Guid planId)
    {
        var result = await planRepository.ActivatePlanForUserAsync(userId, planId);
        if (!result)
        {
            return PlanErrors.PlanActivationFailed;
        }
        return Result.Success();
    }
    public async Task<Result> DeactivatePlanForUserAsync(Guid userId)
    {
        await planRepository.DeactivatePlanForUserAsync(userId);
        return Result.Success();
    }

    public async Task<Result<PlanResponse>> CreatePlanAsync(CreatePlanRequest request, Guid creatorId)
    {
        // Create a new Plan entity based on the request
        var createdPlan = await planRepository.CreatePlanAsync(new()
        {
            CreatedById = creatorId,
            Name = request.Name,
            Description = request.Description,
            Difficulty = request.Difficulty,
            EstimatedDuration = request.EstimatedDuration,
            IsPublic = request.IsPublic,
        });

        // Return the created plan as a response
        return Result<PlanResponse>.Success(createdPlan.ToResponse());
    }
}
