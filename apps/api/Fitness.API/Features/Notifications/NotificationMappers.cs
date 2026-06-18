using Fitness.API.Features.Notifications.Contracts;
using Fitness.API.Features.Notifications.Models;

namespace Fitness.API.Features.Notifications;

public static class NotificationMappers
{
    public static NotificationResponse ToResponse(this Notification notification)
    {
        return new NotificationResponse
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            Type = notification.Type.ToString(),
            Metadata = notification.Metadata,
            ReadAt = notification.ReadAt,
            CreatedAt = notification.CreatedAt,
            UpdatedAt = notification.UpdatedAt
        };
    }
}