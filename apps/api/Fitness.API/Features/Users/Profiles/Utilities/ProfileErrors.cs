using Fitness.API.Core.Utilities;

namespace Fitness.API.Features.Profiles.Utilities;

public static class ProfileErrors
{
    public static ApiError NotFound { get; } =
        new("ProfileNotFound", ErrorType.NotFound, "Profile not found", "The requested profile was not found.");
}