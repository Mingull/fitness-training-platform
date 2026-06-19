using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Auth.Models;

namespace Fitness.API.Features.Devices.Models;

[Table("devices")]
public sealed class Device
{
    [Key]
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;
    public required string ExpoToken { get; init; }
    public DevicePlatform Platform { get; init; }
    public bool IsActive { get; set; }
    public DateTimeOffset LastActiveAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}
