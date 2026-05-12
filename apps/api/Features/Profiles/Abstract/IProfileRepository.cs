using Fitness.API.Features.Profiles.Models;

namespace Fitness.API.Features.Profiles.Abstract;

public interface IProfileRepository
{
    Task<Profile?> GetByProfileIdAsync(Guid userId);
}