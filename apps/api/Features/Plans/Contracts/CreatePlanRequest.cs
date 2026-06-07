namespace Fitness.API.Features.Plans.Contracts;

public record CreatePlanRequest
{
    public string Name { get; set; } = null!;
    public string Difficulty { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int EstimatedDuration { get; set; }
    public bool IsPublic { get; set; }
}