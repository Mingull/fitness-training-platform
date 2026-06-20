using Fitness.API.Core.Utilities;
using Fitness.API.Features.Profiles.Contracts;

namespace Fitness.API.Features.Profiles.Abstract;

public interface IProfileService
{
    Task<Result<ProfileDetailResponse>> GetProfileAsync(Guid userId);
    Task<Result<IEnumerable<ProfileResponse>>> GetAllUserProfilesAsync(Guid userId);
    Task<Result<ProfileDetailResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
}