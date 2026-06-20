using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace Fitness.API.Features.Notifications;

// [Authorize] // as for now, we will not require authorization for the hub, but we will validate the userId in the Register method.
public class NotificationHub(ILogger<NotificationHub> logger) : Hub
{
    public async Task Register(Guid _userId)
    {
        var httpContext = Context.GetHttpContext();
        if (httpContext == null)
        {
            logger.LogWarning("HttpContext is null in NotificationHub.Register for user {UserId}.", _userId);
            Context.Abort();
            return;
        }

        var claimsPrincipal = httpContext.User;
        var userIdClaim = claimsPrincipal.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            logger.LogWarning("Invalid user ID claim in NotificationHub.Register for user {UserId}.", _userId);
            Context.Abort();
            return;
        }

        if (userId != _userId)
        {
            logger.LogWarning("User ID mismatch in NotificationHub.Register. Expected {ExpectedUserId}, but got {ActualUserId}.", _userId, userId);
            Context.Abort();
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, userId.ToString());
    }
}