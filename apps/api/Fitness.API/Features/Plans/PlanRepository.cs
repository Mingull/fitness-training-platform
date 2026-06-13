using Fitness.API.Core.Contexts;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.Workouts.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Plans;

public class PlanRepository(FitnessContext context) : IPlanRepository
{
    public async Task<IEnumerable<Plan>> GetAllAsync(Guid? userId)
    {
        // Filter out private plans that do not belong to the authenticated user
        return await context.Plans
            .Where(plan => plan.IsPublic || plan.CreatedById == userId)
            .Include(plan => plan.CreatedBy)
                .ThenInclude(user => user.Profile)
            .ToListAsync();
    }

    public async Task<Plan?> GetByIdAsync(Guid planId, bool withWorkouts = false)
    {
        IQueryable<Plan> query = context.Plans
            .Include(plan => plan.CreatedBy)
            .ThenInclude(user => user.Profile);

        if (withWorkouts)
        {
            query = query.Include(plan => plan.Workouts);
        }

        return await query.FirstOrDefaultAsync(plan => plan.Id == planId);
    }
    public Task<ActiveUserPlan?> GetActivePlanForUserAsync(Guid userId)
    {
        return context.ActiveUserPlans
            .Include(ap => ap.Plan)
                .ThenInclude(plan => plan.CreatedBy)
                    .ThenInclude(user => user.Profile)
            .FirstOrDefaultAsync(ap => ap.UserId == userId);
    }

    public async Task<bool> ActivatePlanForUserAsync(Guid userId, Guid planId)
    {
        // First, deactivate any active plan for the user
        await DeactivatePlanForUserAsync(userId);

        // Then, activate the new plan
        var activeUserPlan = new ActiveUserPlan
        {
            UserId = userId,
            PlanId = planId,
            ActivatedAt = DateTime.UtcNow
        };

        context.ActiveUserPlans.Add(activeUserPlan);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeactivatePlanForUserAsync(Guid userId)
    {
        return await context.ActiveUserPlans.Where(ap => ap.UserId == userId).ExecuteDeleteAsync() > 0;
    }

    public async Task<Plan> CreatePlanAsync(Plan plan)
    {
        // Generate a new ID for the plan
        plan.Id = Guid.CreateVersion7();

        // Add the plan to the context and save changes
        context.Plans.Add(plan);
        await context.SaveChangesAsync();

        // Reload the plan with the CreatedBy navigation property included to ensure the response is complete
        return await GetByIdAsync(plan.Id) ?? plan;
    }

    public async Task AddWorkoutAsync(Guid planId, Workout workout)
    {
        workout.Id = Guid.CreateVersion7();
        workout.PlanId = planId;

        context.Workouts.Add(workout);
        await context.SaveChangesAsync();
    }
}