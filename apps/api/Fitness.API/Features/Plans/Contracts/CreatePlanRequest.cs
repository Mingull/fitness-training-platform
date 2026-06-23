using System.ComponentModel.DataAnnotations;

namespace Fitness.API.Features.Plans.Contracts;

public record CreatePlanRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = String.Empty;
    [Required]
    [MinLength(2)]
    [MaxLength(1000)]
    public string Description { get; set; } = String.Empty;
    [Required]
    public int Difficulty { get; set; }
    [Required]
    public int EstimatedDuration { get; set; }
    [Required]
    public bool IsPublic { get; set; }
}