using Fitness.API.Core.Utilities;

namespace Fitness.API.Features.Plans.Utilities;

public static class PlanErrors
{
    public static ApiError NotFound { get; } = new("NoPlanFound", ErrorType.NotFound, "Plan not found", "The requested plan was not found.");
    public static ApiError PlanActivationFailed { get; } = new("PlanActivationFailed", ErrorType.InternalError, "Failed to activate plan", "An error occurred while trying to activate the plan. Please try again later.");
    public static ApiError PlanDeactivationFailed { get; } = new("PlanDeactivationFailed", ErrorType.InternalError, "Failed to deactivate plan", "An error occurred while trying to deactivate the plan. Please try again later.");
    public static ApiError ReorderWorkoutsFailed { get; } = new("ReorderWorkoutsFailed", ErrorType.InternalError, "Failed to reorder workouts", "An error occurred while trying to reorder workouts in the plan. Please try again later.");
    public static ApiError InvalidWorkoutReorderRequest(string detail) => new("InvalidWorkoutReorderRequest", ErrorType.BadRequest, "Invalid workout reorder request", detail);
    public static ApiError WorkoutNotPartOfPlan(Guid workoutId) => new("WorkoutNotPartOfPlan", ErrorType.BadRequest, "Workout not part of plan", $"The workout with ID {workoutId} does not belong to this plan.");
}