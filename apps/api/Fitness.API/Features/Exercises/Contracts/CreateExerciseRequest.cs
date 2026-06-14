using System.ComponentModel.DataAnnotations;

namespace Fitness.API.Features.Exercises.Contracts;

public record CreateExerciseRequest
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public required string Name { get; set; }
    [Required]
    [MinLength(2)]
    [MaxLength(1000)]
    public required string Description { get; set; }
    public string? MediaUrl { get; set; }
}