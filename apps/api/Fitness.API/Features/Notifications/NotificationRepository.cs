using Fitness.API.Core.Contexts;
using Fitness.API.Features.Devices.Models;
using Fitness.API.Features.Notifications.Abstract;
using Fitness.API.Features.Notifications.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Notifications;

public class NotificationRepository(FitnessContext context) : INotificationRepository
{
    public async Task<Notification> CreateAsync(Notification notification)
    {
        notification.Id = Guid.CreateVersion7();
        notification.CreatedAt = DateTime.UtcNow;

        context.Notifications.Add(notification);
        await context.SaveChangesAsync();
        return notification;
    }

    public async Task<IEnumerable<Notification>> GetAllAsync(Guid userId)
    {
        return await context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<Notification?> GetByIdAsync(Guid userId, Guid notificationId)
    {
        return await context.Notifications
            .FirstOrDefaultAsync(n => n.UserId == userId && n.Id == notificationId);
    }

    public async Task MarkAsReadAsync(Guid userId, Guid notificationId)
    {
        await context.Notifications
            .Where(n => n.UserId == userId && n.Id == notificationId)
            .ExecuteUpdateAsync(n => n.SetProperty(n => n.ReadAt, DateTime.UtcNow));
    }
}