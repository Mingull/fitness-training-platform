using Fitness.API.Core.Contexts;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Plans.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Plans;

public class PlanRepository(FitnessContext context) : IPlanRepository
{
    public async Task<IEnumerable<Plan>> GetAllPlansAsync()
    {
        return await context.Plans.ToListAsync();
    }
}