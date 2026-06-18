using Fitness.API.Core.Utilities;
using Fitness.API.Features.Devices.Contracts;
using Fitness.API.Features.Devices.Models;

namespace Fitness.API.Features.Devices.Abstract;

public interface IDeviceService
{
    Task<Result<DeviceResponse>> RegisterDeviceAsync(Guid userId, string expoToken, DevicePlatform platform);
    Task<Result> DeactivateDeviceAsync(Guid userId, string expoToken);
}