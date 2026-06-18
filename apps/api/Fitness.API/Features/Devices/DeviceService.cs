using Fitness.API.Core.Contexts;
using Fitness.API.Core.Utilities;
using Fitness.API.Features.Devices.Abstract;
using Fitness.API.Features.Devices.Contracts;
using Fitness.API.Features.Devices.Models;
using Fitness.API.Features.Devices.Utilities;

namespace Fitness.API.Features.Devices;

public class DeviceService(IDeviceRepository repository) : IDeviceService
{
    public async Task<Result<DeviceResponse>> RegisterDeviceAsync(Guid userId, string expoToken, DevicePlatform platform)
    {
        // step 1: check if device already exists
        var existingDevice = await repository.GetByUserIdAndExpoTokenAsync(userId, expoToken);

        // step 2: if it exists, update last active timestamp and set is_active to true
        if (existingDevice != null)
        {
            await repository.MarkDeviceActiveAsync(existingDevice.Id);
            var updatedDevice = await repository.GetByUserIdAndExpoTokenAsync(userId, expoToken);
            return Result<DeviceResponse>.Success(updatedDevice!.ToResponse());
        }

        // step 3: if it doesn't exist, create a new device record
        var device = await repository.CreateAsync(new()
        {
            UserId = userId,
            ExpoToken = expoToken,
            Platform = platform,
        });

        return Result<DeviceResponse>.Success(device.ToResponse());
    }

    public async Task<Result> DeactivateDeviceAsync(Guid userId, string expoToken)
    {
        // step 1: check if device exists, if not, return an error
        var existingDevice = await repository.GetByUserIdAndExpoTokenAsync(userId, expoToken);
        if (existingDevice == null)
        {
            return DeviceErrors.NotFound;
        }

        // step 2: if it exists, update last active timestamp and set is_active to false
        await repository.MarkDeviceInactiveAsync(existingDevice.Id);

        return Result.Success();
    }

}
