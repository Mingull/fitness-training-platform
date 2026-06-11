using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Auth.Models;

namespace Fitness.API.Features.Profiles.Models;

[Table("profiles")]
public sealed class Profile
{
    [Key]
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public ExperienceLevel ExperienceLevel { get; set; } = ExperienceLevel.Beginner;
    public string? Bio { get; set; }
    public string? Goals { get; set; }
    public string? PictureUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}