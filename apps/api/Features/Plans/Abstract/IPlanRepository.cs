using Fitness.API.Features.Plans.Models;

namespace Fitness.API.Features.Plans.Abstract;

public interface IPlanRepository
{
    Task<IEnumerable<Plan>> GetAllPlansAsync();
}