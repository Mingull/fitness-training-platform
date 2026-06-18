using Microsoft.AspNetCore.SignalR;

namespace Fitness.API.Features.Notifications;

public class NotificationHub : Hub
{
    public async Task Register(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, userId);
    }
}