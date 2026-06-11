namespace Fitness.API.Features.Plans.Contracts;

public record PlanResponse
{
    public required Guid Id { get; set; }
    public required PlanCreatorResponse Creator { get; set; }
    public required string Name { get; set; }
    public required PlanDifficultyResponse Difficulty { get; set; }
    public required string Description { get; set; }
    public required int EstimatedDuration { get; set; }
    public required bool IsPublic { get; set; }
    public required DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}