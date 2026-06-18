using Fitness.API.Core.Utilities;

namespace Fitness.API.Features.Notifications.Utilities;

public static class NotificationErrors
{
    public static ApiError NotFound { get; } = new("NotificationNotFound", ErrorType.NotFound, "Notification not found", "The specified notification could not be found.");
}