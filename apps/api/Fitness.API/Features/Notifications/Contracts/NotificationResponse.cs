using Fitness.API.Features.Notifications.Models;

namespace Fitness.API.Features.Notifications.Contracts;

public record NotificationResponse
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public required string Message { get; init; }
    public required string Type { get; init; }
    public string? Metadata { get; init; }
    public DateTimeOffset? ReadAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}