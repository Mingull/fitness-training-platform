using Fitness.API.Core.Utilities;
using Fitness.API.Features.Plans.Contracts;
using Fitness.API.Features.Plans.Models;

namespace Fitness.API.Features.Plans.Abstract;

public interface IPlanService
{
    Task<Result<IEnumerable<PlanResponse>>> GetAllPlansAsync(Guid userId);
}