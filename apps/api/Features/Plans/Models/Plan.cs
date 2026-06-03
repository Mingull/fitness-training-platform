using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Auth.Models;

namespace Fitness.API.Features.Plans.Models;

[Table("plans")]
public sealed class Plan
{
    [Key]
    public Guid Id { get; set; }
    public AppUser CreatedBy { get; set; } = null!;
    public Guid CreatedById { get; set; }
    [MaxLength(100)]
    [Required]
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Difficulty { get; set; } = null!;
    public int EstimatedDuration { get; set; }
    public bool IsPublic { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}