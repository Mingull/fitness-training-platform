using System.Text.Json;
using Fitness.API.Core.Utilities;
using Fitness.API.Features.Devices.Abstract;
using Fitness.API.Features.Notifications.Abstract;
using Fitness.API.Features.Notifications.Contracts;
using Fitness.API.Features.Notifications.Models;
using Fitness.API.Features.Notifications.Utilities;
using Microsoft.AspNetCore.SignalR;

namespace Fitness.API.Features.Notifications;

public class NotificationService(
    INotificationRepository repository,
    IDeviceRepository deviceRepository,
    IHubContext<NotificationHub> hub,
    ExpoPushService expo,
    ILogger<NotificationService> logger) : INotificationService
{
    public async Task<Result<IEnumerable<NotificationResponse>>> GetNotificationsByUserIdAsync(Guid userId)
    {
        var notifications = await repository.GetAllAsync(userId);
        var notificationResponses = notifications.Select(n => n.ToResponse());

        return Result<IEnumerable<NotificationResponse>>.Success(notificationResponses);
    }

    public async Task<Result> MarkNotificationAsReadAsync(Guid userId, Guid notificationId)
    {
        var notification = await repository.GetByIdAsync(userId, notificationId);

        if (notification is null) return NotificationErrors.NotFound;

        await repository.MarkAsReadAsync(userId, notificationId);
        return Result.Success();
    }

    public async Task SendAsync(Guid userId, string title, string message, NotificationType type, Dictionary<string, object>? metadata = null)
    {
        // 1. Save in DB
        var created = await repository.CreateAsync(new()
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            Metadata = metadata is null ? null : JsonSerializer.Serialize(metadata)
        });

        // 2. Try realtime (SignalR)
        var connections = hub.Clients.Group(userId.ToString());
        try
        {
            var response = created.ToResponse();
            await connections.SendAsync("notification", new { title, message, type, metadata });
            await connections.SendAsync("notification_created", response);
        }
        catch (Exception ex)
        {
            // log only, do NOT fail notification
            logger.LogWarning(ex, "Failed to broadcast notification over SignalR for user {UserId}.", userId);
        }

        // 3. Send push (fallback / always for safety)
        var devices = await deviceRepository.GetDevicesByUserIdAsync(userId);
        var deviceList = devices.ToList();

        if (deviceList.Count == 0)
        {
            logger.LogInformation("No active devices found for user {UserId}. Skipping push delivery.", userId);
            return;
        }

        foreach (var device in deviceList)
        {
            try
            {
                logger.LogInformation("Sending push notification to device {DeviceId} with token {ExpoToken} for user {UserId}.", device.Id, device.ExpoToken, userId);
                await expo.SendAsync(new()
                {
                    To = device.ExpoToken,
                    Title = title,
                    Body = message,
                    ChannelId = "default",
                    Data = new
                    {
                        type,
                        metadata
                    }
                });
            }
            catch (ExpoPushException ex)
            {
                await deviceRepository.MarkDeviceInactiveAsync(device.Id);
                logger.LogWarning(ex, "Failed to send notification to device {DeviceId} with token {ExpoToken}. Marked device as inactive.", device.Id, device.ExpoToken);
            }
            catch (Exception ex)
            {
                // Push delivery issues should not fail the notification flow if persistence already succeeded.
                logger.LogWarning(ex, "Failed to deliver push notification to device {DeviceId}.", device.Id);
            }
        }
    }

    public async Task<Result> SendTestNotificationAsync(Guid userId)
    {
        try
        {
            await SendAsync(
                userId,
                "Test Notification",
                "This is a test notification to verify that everything is working correctly.",
                NotificationType.TrainerRequest
            );

            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send test notification to user {UserId}.", userId);
            return Result.Failure(
                new(
                    code: "FailedToSendTestNotification",
                    type: ErrorType.InternalError,
                    title: "Failed to send test notification",
                    detail: "An error occurred while trying to send the test notification. Please try again later."
                )
            );
        }
    }
}
