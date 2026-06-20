using Fitness.API.Features.Profiles.Models;

namespace Fitness.API.Features.Profiles.Abstract;

public interface IProfileRepository
{
    Task<Profile> CreateAsync(Profile profile);
    Task<Profile?> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Profile>> GetAllAsync();
    Task UpdateAsync(Profile profile);
}