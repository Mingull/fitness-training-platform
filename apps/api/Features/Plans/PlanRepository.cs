using Fitness.API.Core.Contexts;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Plans.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Plans;

public class PlanRepository(FitnessContext context) : IPlanRepository
{
    public async Task<IEnumerable<Plan>> GetAllPlansAsync(Guid? userId)
    {
        // Filter out private plans that do not belong to the authenticated user
        return await context.Plans
            .Where(plan => plan.IsPublic || plan.CreatedById == userId)
            .Include(plan => plan.CreatedBy)
                .ThenInclude(user => user.Profile)
            .ToListAsync();
    }

    public async Task<Plan?> GetPlanByIdAsync(Guid planId)
    {
        return await context.Plans
            .Include(plan => plan.CreatedBy)
                .ThenInclude(user => user.Profile)
            .FirstOrDefaultAsync(plan => plan.Id == planId);
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

        // Reload with navigations used by ToResponse() so the API response contains creator details
        return await context.Plans
            .Include(p => p.CreatedBy)
                .ThenInclude(u => u.Profile)
            .FirstAsync(p => p.Id == plan.Id);
    }
}