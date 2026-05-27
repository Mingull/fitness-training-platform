using Fitness.API.Core.Contexts;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Plans.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Plans;

public class PlanRepository(FitnessContext context) : IPlanRepository
{
    public async Task<IEnumerable<Plan>> GetAllPlansAsync(Guid userId)
    {
        // Filter out private plans that do not belong to the authenticated user
        return await context.Plans
            .Where(plan => plan.IsPublic || plan.CreatedById == userId)
            .Include(plan => plan.CreatedBy)
                .ThenInclude(user => user.Profile)
            .ToListAsync();
    }
}