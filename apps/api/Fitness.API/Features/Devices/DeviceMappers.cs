using Fitness.API.Features.Devices.Contracts;
using Fitness.API.Features.Devices.Models;

namespace Fitness.API.Features.Devices;

public static class DeviceMappers
{
    public static DeviceResponse ToResponse(this Device device)
    {
        return new DeviceResponse
        {
            Id = device.Id,
            ExpoToken = device.ExpoToken,
            Platform = device.Platform.ToString(),
            IsActive = device.IsActive,
            LastActiveAt = device.LastActiveAt,
            CreatedAt = device.CreatedAt,
            UpdatedAt = device.UpdatedAt,
        };
    }
}