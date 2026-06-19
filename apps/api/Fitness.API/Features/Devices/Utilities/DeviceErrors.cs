using Fitness.API.Core.Utilities;

namespace Fitness.API.Features.Devices.Utilities;

public static class DeviceErrors
{
    public static ApiError NotFound { get; } = new("DeviceNotFound", ErrorType.NotFound, "Device not found", "The specified device could not be found.");
}