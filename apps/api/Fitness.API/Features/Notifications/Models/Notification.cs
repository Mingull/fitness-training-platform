using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Auth.Models;

namespace Fitness.API.Features.Notifications.Models;

[Table("notifications")]
public sealed class Notification
{
    [Key]
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;
    [MaxLength(100)]
    public required string Title { get; init; }
    public required string Message { get; init; }
    public required NotificationType Type { get; init; }
    public string? Metadata { get; init; }
    public DateTimeOffset? ReadAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
