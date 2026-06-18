using Fitness.API.Core.Contracts;
using Fitness.API.Core.Extensions;
using Fitness.API.Core.Utilities;
using Fitness.API.Features.Notifications.Abstract;
using Fitness.API.Features.Notifications.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.API.Features.Notifications;

[ApiController]
[Route("notifications")]
public class NotificationController(INotificationService notificationService) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetNotifications()
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));

        var result = await notificationService.GetNotificationsByUserIdAsync(userId.Value);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<IEnumerable<NotificationResponse>>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Notifications retrieved successfully",
            Data = result.Value
        });
    }

    [HttpPatch("{notificationId}/read")]
    [Authorize]
    public async Task<IActionResult> MarkNotificationAsRead([FromRoute] Guid notificationId)
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));

        var result = await notificationService.MarkNotificationAsReadAsync(userId.Value, notificationId);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Notification marked as read successfully"
        });
    }

    [HttpPost("test")]
    [Authorize]
    public async Task<IActionResult> SendTestNotification()
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));

        var result = await notificationService.SendTestNotificationAsync(userId.Value);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Test notification sent successfully"
        });
    }
}