using Fitness.API.Core.Utilities;
using Fitness.API.Features.Profiles.Contracts;

namespace Fitness.API.Features.Profiles.Abstract;

public interface IProfileService
{
    Task<Result<ProfileResponse>> GetProfileAsync(Guid userId);
    Task<Result<ProfileResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
}