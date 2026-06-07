using System.ComponentModel.DataAnnotations;

namespace Fitness.API.Features.Plans.Contracts;

public record CreatePlanRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Difficulty { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    public int EstimatedDuration { get; set; }
    public bool IsPublic { get; set; }
}