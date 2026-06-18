namespace Fitness.API.Features.Notifications.Contracts;

public record SendNotificationRequest
{
    public required Guid UserId { get; init; }
    public required string Title { get; init; }
    public required string Message { get; init; }
    public required string Type { get; init; }
    public Dictionary<string, object>? Metadata { get; init; }
}