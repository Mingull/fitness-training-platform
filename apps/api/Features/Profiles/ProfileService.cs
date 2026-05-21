using Fitness.API.Core.Utilities;
using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Profiles.Abstract;
using Fitness.API.Features.Profiles.Contracts;
using Fitness.API.Features.Profiles.Utilities;
using Microsoft.AspNetCore.Identity;

namespace Fitness.API.Features.Profiles;

public class ProfileService(IProfileRepository profileRepository, UserManager<AppUser> userManager) : IProfileService
{
    public async Task<Result<ProfileResponse>> GetProfileAsync(Guid userId)
    {
        var profile = await profileRepository.GetByUserIdAsync(userId);
        if (profile == null)
        {
            return ProfileErrors.NotFound;
        }

        var roles = await userManager.GetRolesAsync(profile.User);

        return Result<ProfileResponse>.Success(new ProfileResponse
        {
            Id = profile.Id,
            UserId = profile.User.Id,
            Username = profile.User.UserName,
            Email = profile.User.Email,
            Roles = roles,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            Bio = profile.Bio,
            Goals = profile.Goals,
            ExperienceLevel = profile.ExperienceLevel,
            PictureUrl = profile.PictureUrl
        });
    }

    public async Task<Result<ProfileResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var profile = await profileRepository.GetByUserIdAsync(userId);
        if (profile == null)
        {
            return ProfileErrors.NotFound;
        }

        profile.FirstName = request.FirstName ?? profile.FirstName;
        profile.LastName = request.LastName ?? profile.LastName;
        profile.Bio = request.Bio ?? profile.Bio;
        profile.Goals = request.Goals ?? profile.Goals;
        profile.ExperienceLevel = request.ExperienceLevel ?? profile.ExperienceLevel;
        profile.PictureUrl = request.PictureUrl ?? profile.PictureUrl;

        await profileRepository.UpdateAsync(profile);
        var roles = await userManager.GetRolesAsync(profile.User);

        return Result<ProfileResponse>.Success(new ProfileResponse
        {
            Id = profile.Id,
            UserId = profile.User.Id,
            Username = profile.User.UserName,
            Email = profile.User.Email,
            Roles = roles,
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            Bio = profile.Bio,
            Goals = profile.Goals,
            ExperienceLevel = profile.ExperienceLevel,
            PictureUrl = profile.PictureUrl
        });
    }
}