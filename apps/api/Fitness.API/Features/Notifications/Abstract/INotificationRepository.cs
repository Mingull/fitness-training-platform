using Fitness.API.Features.Devices.Models;
using Fitness.API.Features.Notifications.Models;

namespace Fitness.API.Features.Notifications.Abstract;

public interface INotificationRepository
{
    Task<Notification> CreateAsync(Notification notification);
    Task<IEnumerable<Notification>> GetAllAsync(Guid userId);
    Task<Notification?> GetByIdAsync(Guid userId, Guid notificationId);
    Task MarkAsReadAsync(Guid userId, Guid notificationId);
}