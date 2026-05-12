using Fitness.API.Core.Utilities;
using Fitness.API.Features.Profiles.Abstract;
using Fitness.API.Features.Profiles.Contracts;
using Fitness.API.Features.Profiles.Utilities;

namespace Fitness.API.Features.Profiles;

public class ProfileService(IProfileRepository profileRepository, ILogger<ProfileService> logger) : IProfileService
{
    public async Task<Result<ProfileResponse>> GetProfileAsync(Guid userId)
    {
        var profile = await profileRepository.GetByProfileIdAsync(userId);
        if (profile == null)
        {
            return ProfileErrors.NotFound;
        }
        logger.LogInformation("Profile found for userId {UserId}", userId);
        
        return Result<ProfileResponse>.Success(new ProfileResponse
        {
            Id = profile.UserId,
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