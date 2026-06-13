using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.WorkoutExercises.Models;

namespace Fitness.API.Features.Exercises.Models;

[Table("exercises")]
public sealed class Exercise
{
    [Key]
    public Guid Id { get; set; }
    public AppUser CreatedBy { get; set; } = null!;
    public Guid CreatedById { get; set; }
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public required string Name { get; set; }
    [Required]
    [MinLength(2)]
    [MaxLength(1000)]
    public required string Description { get; set; }
    public string? MediaUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = [];
}