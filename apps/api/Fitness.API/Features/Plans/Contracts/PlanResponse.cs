using Fitness.API.Features.Users.Contracts;

namespace Fitness.API.Features.Plans.Contracts;

public record PlanResponse
{
    public required Guid Id { get; init; }
    public required CreatorResponse Creator { get; init; }
    public required string Name { get; init; }
    public required PlanDifficultyResponse Difficulty { get; init; }
    public required string Description { get; init; }
    public required int EstimatedDuration { get; init; }
    public required bool IsPublic { get; init; }
    public required DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public DateTime? DeletedAt { get; init; }
}