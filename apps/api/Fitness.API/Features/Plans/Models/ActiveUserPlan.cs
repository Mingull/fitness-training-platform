using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Auth.Models;

namespace Fitness.API.Features.Plans.Models;

[Table("active_user_plans")]
public sealed class ActiveUserPlan
{
    [Key]
    public Guid UserId { get; init; }
    public AppUser User { get; init; } = null!;
    public Guid PlanId { get; init; }
    public Plan Plan { get; init; } = null!;
    public DateTime ActivatedAt { get; init; } = DateTime.UtcNow;
}