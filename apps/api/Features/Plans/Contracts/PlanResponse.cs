namespace Fitness.API.Features.Plans.Contracts;

public record PlanResponse
{
    public Guid Id { get; set; }
    public PlanCreator Creator { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int EstimatedDuration { get; set; }
    public bool IsPublic { get; set; }
}