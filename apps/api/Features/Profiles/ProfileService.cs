using Fitness.API.Core.Utilities;
using Fitness.API.Features.Profiles.Abstract;
using Fitness.API.Features.Profiles.Contracts;
using Fitness.API.Features.Profiles.Utilities;

namespace Fitness.API.Features.Profiles;

public class ProfileService(IProfileRepository profileRepository) : IProfileService
{
    public async Task<Result<ProfileResponse>> GetProfileAsync(Guid userId)
    {
        var profile = await profileRepository.GetByUserIdAsync(userId);
        if (profile == null)
        {
            return ProfileErrors.NotFound;
        }

        return Result<ProfileResponse>.Success(new ProfileResponse
        {
            Id = profile.Id,
            UserId = profile.User.Id,
            Username = profile.User.UserName,
            Email = profile.User.Email,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            Bio = profile.Bio,
            Goals = profile.Goals,
            ExperienceLevel = profile.ExperienceLevel,
            PictureUrl = profile.PictureUrl
        });
    }
}