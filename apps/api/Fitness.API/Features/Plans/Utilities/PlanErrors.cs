using Fitness.API.Core.Utilities;

namespace Fitness.API.Features.Plans.Utilities;

public static class PlanErrors
{
    public static ApiError NotFound { get; } = new("NoPlanFound", ErrorType.NotFound, "Plan not found", "The requested plan was not found.");
    public static ApiError PlanActivationFailed { get; } = new("PlanActivationFailed", ErrorType.InternalError, "Failed to activate plan", "An error occurred while trying to activate the plan. Please try again later.");
    public static ApiError PlanDeactivationFailed { get; } = new("PlanDeactivationFailed", ErrorType.InternalError, "Failed to deactivate plan", "An error occurred while trying to deactivate the plan. Please try again later.");
}