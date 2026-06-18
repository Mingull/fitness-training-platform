using System.Text.Json.Serialization;

namespace Fitness.API.Features.Notifications.Contracts;

/// <summary>
/// Represents the payload for a notification sent via Expo Push Service.
/// This only includes the shared options between Android and iOS
/// This payload is based on https://docs.expo.dev/push-notifications/sending-notifications/#formats
/// </summary>
public record NotificationPayload
{
    public required string To { get; init; }
    public object? Data { get; init; }
    public string? Title { get; init; }
    public string? Body { get; init; }
    public int? Ttl { get; init; }
    public int? Expiration { get; init; }
    public NotificationPayloadPriority? Priority { get; init; }
    public object? RichContent { get; init; }
    public string? CategoryId { get; init; }
    public string? CollapseId { get; init; }
    /// <summary>
    /// Android only
    /// </summary>
    public string? ChannelId { get; init; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum NotificationPayloadPriority
{
    Default,
    Normal,
    High
}