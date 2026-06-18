using Fitness.API.Core.Contexts;
using Fitness.API.Features.Devices.Abstract;
using Fitness.API.Features.Devices.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Devices;

public class DeviceRepository(FitnessContext context) : IDeviceRepository
{
    public async Task<Device> CreateAsync(Device device)
    {
        // Set default values for the new device
        device.Id = Guid.CreateVersion7();
        device.IsActive = true;
        device.LastActiveAt = DateTime.UtcNow;
        device.CreatedAt = DateTime.UtcNow;

        context.Devices.Add(device);
        await context.SaveChangesAsync();
        return device;
    }

    public async Task<Device?> GetByUserIdAndExpoTokenAsync(Guid userId, string expoToken)
    {
        return await context.Devices.FirstOrDefaultAsync(d => d.UserId == userId && d.ExpoToken == expoToken);
    }

    public async Task<IEnumerable<Device>> GetDevicesByUserIdAsync(Guid userId)
    {
        return await context.Devices
            .Where(d => d.UserId == userId && d.IsActive)
            .ToListAsync();
    }
    public async Task MarkDeviceActiveAsync(Guid deviceId)
    {
        // We just mark the device as active and update the last active timestamp. This way we can keep a history of devices and their activity.
        await context.Devices
              .Where(d => d.Id == deviceId)
              .ExecuteUpdateAsync(d => d.SetProperty(p => p.IsActive, true)
              .SetProperty(p => p.LastActiveAt, DateTime.UtcNow));
    }

    public async Task MarkDeviceInactiveAsync(Guid deviceId)
    {
        // We just mark the device as inactive and update the last active timestamp. This way we can keep a history of devices and their activity.
        await context.Devices
              .Where(d => d.Id == deviceId)
              .ExecuteUpdateAsync(d => d.SetProperty(p => p.IsActive, false)
              .SetProperty(p => p.LastActiveAt, DateTime.UtcNow));
    }
}
