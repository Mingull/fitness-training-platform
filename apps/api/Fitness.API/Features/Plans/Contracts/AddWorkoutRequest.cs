using System.ComponentModel.DataAnnotations;

namespace Fitness.API.Features.Plans.Contracts;

public record AddWorkoutRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = String.Empty;
}