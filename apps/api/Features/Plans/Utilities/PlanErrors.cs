using Fitness.API.Core.Utilities;

namespace Fitness.API.Features.Plans.Utilities;

public static class PlanErrors
{
    public static ApiError NotFound { get; } =
        new("NoPlanFound", ErrorType.NotFound, "Plan not found", "The requested plan was not found.");
}