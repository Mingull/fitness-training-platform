using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Auth.Models;

namespace Fitness.API.Features.Plans.Models;

[Table("active_user_plans")]
public sealed class ActiveUserPlan
{
    [Key]
    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;
    public Guid PlanId { get; set; }
    public Plan Plan { get; set; } = null!;
    public DateTime ActivatedAt { get; set; } = DateTime.UtcNow;
}