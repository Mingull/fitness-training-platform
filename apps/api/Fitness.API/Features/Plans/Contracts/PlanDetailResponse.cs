using Fitness.API.Features.Users.Contracts;
using Fitness.API.Features.Workouts.Contracts;

namespace Fitness.API.Features.Plans.Contracts;

public record PlanDetailResponse
{
    public required Guid Id { get; set; }
    public required CreatorResponse Creator { get; set; }
    public required string Name { get; set; }
    public required PlanDifficultyResponse Difficulty { get; set; }
    public required string Description { get; set; }
    public required int EstimatedDuration { get; set; }
    public required bool IsPublic { get; set; }
    public required DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<WorkoutResponse> Workouts { get; set; } = [];
}