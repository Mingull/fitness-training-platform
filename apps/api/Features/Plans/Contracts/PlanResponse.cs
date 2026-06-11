namespace Fitness.API.Features.Plans.Contracts;

public record PlanResponse
{
    public Guid Id { get; set; }
    public PlanCreatorResponse Creator { get; set; } = null!;
    public string Name { get; set; } = null!;
    public PlanDifficultyResponse Difficulty { get; set; }
    public string Description { get; set; } = null!;
    public int EstimatedDuration { get; set; }
    public bool IsPublic { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}