using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Workouts.Models;

namespace Fitness.API.Features.Plans.Models;

[Table("plans")]
public sealed class Plan
{
    [Key]
    public Guid Id { get; set; }
    public AppUser CreatedBy { get; set; } = null!;
    public Guid CreatedById { get; init; }
    [MaxLength(100)]
    [Required]
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required int DifficultyLevel { get; init; }
    public required int EstimatedDuration { get; init; }
    public required bool IsPublic { get; init; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public DateTime? DeletedAt { get; private set; }

    public ICollection<Workout> Workouts { get; init; } = [];
}