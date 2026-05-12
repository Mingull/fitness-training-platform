using Fitness.API.Features.Profiles.Models;

namespace Fitness.API.Features.Profiles.Abstract;

public interface IProfileRepository
{
    Task<Profile?> GetByUserIdAsync(Guid userId);
}