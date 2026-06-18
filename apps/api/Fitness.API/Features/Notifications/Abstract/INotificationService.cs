using Fitness.API.Core.Utilities;
using Fitness.API.Features.Notifications.Contracts;
using Fitness.API.Features.Notifications.Models;

namespace Fitness.API.Features.Notifications.Abstract;

public interface INotificationService
{
    Task<Result<IEnumerable<NotificationResponse>>> GetNotificationsByUserIdAsync(Guid userId);
    Task<Result> MarkNotificationAsReadAsync(Guid userId, Guid notificationId);
    Task SendAsync(Guid userId, string title, string message, NotificationType type, Dictionary<string, object>? metadata = null);
    Task<Result> SendTestNotificationAsync(Guid userId);
}