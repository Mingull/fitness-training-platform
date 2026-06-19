using Fitness.API.Features.Devices.Models;

namespace Fitness.API.Features.Devices.Abstract;

public interface IDeviceRepository
{
    Task<Device> CreateAsync(Device device);
    Task<Device?> GetByUserIdAndExpoTokenAsync(Guid userId, string expoToken);
    Task<IEnumerable<Device>> GetDevicesByUserIdAsync(Guid userId);
    Task MarkDeviceActiveAsync(Guid deviceId);
    Task MarkDeviceInactiveAsync(Guid deviceId);
}