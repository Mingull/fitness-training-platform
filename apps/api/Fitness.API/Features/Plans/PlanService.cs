using Fitness.API.Core.Utilities;
using Fitness.API.Features.Auth.Utilities;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Plans.Contracts;
using Fitness.API.Features.Plans;
using Fitness.API.Features.Plans.Utilities;
using Fitness.API.Features.Users;
using Fitness.API.Features.Users.Contracts;
using Fitness.API.Features.Workouts.Contracts;

namespace Fitness.API.Features.Plans;

public class PlanService(IPlanRepository planRepository) : IPlanService
{
    public async Task<Result<IEnumerable<PlanResponse>>> GetAllPlansAsync(Guid? userId)
    {
        // Get all plans from the repository
        var plans = await planRepository.GetAllAsync(userId);

        // Plans now include the CreatedBy -> AppUser -> Profile navigation
        var planResponses = new List<PlanResponse>();

        foreach (var plan in plans)
        {
            planResponses.Add(plan.ToResponse());
            continue;
        }

        return Result<IEnumerable<PlanResponse>>.Success(planResponses);
    }

    public async Task<Result<PlanDetailResponse>> GetPlanByIdAsync(Guid planId, Guid? userId = null)
    {
        var plan = await planRepository.GetByIdAsync(planId, withWorkouts: true);

        if (plan == null)
        {
            return PlanErrors.NotFound;
        }

        // If the plan is private and the user is not the owner, return an error
        if (!plan.IsPublic && plan.CreatedById != userId)
        {
            return PlanErrors.NotFound; // Return not found to avoid exposing the existence of the plan
        }

        return Result<PlanDetailResponse>.Success(plan.ToDetailResponse());
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
            DifficultyLevel = request.Difficulty,
            EstimatedDuration = request.EstimatedDuration,
            IsPublic = request.IsPublic,
        });

        // Return the created plan as a response
        return Result<PlanResponse>.Success(createdPlan.ToResponse());
    }

    public async Task<Result<PlanDetailResponse>> AddWorkoutToPlanAsync(Guid planId, AddWorkoutRequest request, Guid userId)
    {
        var plan = await planRepository.GetByIdAsync(planId, withWorkouts: true);

        if (plan == null)
            return PlanErrors.NotFound;

        // Check if the user has permission to modify the plan
        if (plan.CreatedById != userId)
            return AuthErrors.UnauthorizedWithResource("plan");

        // Add the workout to the plan
        var nextOrder = plan.Workouts.Count == 0
                ? 1
                : plan.Workouts.Max(workout => workout.Order) + 1;

        await planRepository.AddWorkoutAsync(plan.Id, new()
        {
            Name = request.Name,
            Order = nextOrder
        });

        // Reload the plan with workouts to return the updated details
        plan = await planRepository.GetByIdAsync(planId, withWorkouts: true);
        return Result<PlanDetailResponse>.Success(plan!.ToDetailResponse());
    }
}
