using Fitness.API.Core.Utilities;

namespace Fitness.API.Features.Profiles.Utilities;

public static class ProfileErrors
{
    public static ApiError NotFound { get; } =
        new("ProfileNotFound", ErrorType.NotFound, "Profile not found", "The requested profile was not found.");

    public static ApiError InvalidProfilePicture(string detail) =>
        new("InvalidProfilePicture", ErrorType.Validation, "Validation failed", detail, new Dictionary<string, string[]>
        {
            { "pictureUrl", [detail] }
        });
}