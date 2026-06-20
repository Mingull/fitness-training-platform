using Fitness.API.Core.Utilities;
using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Plans;
using Fitness.API.Features.Profiles.Abstract;
using Fitness.API.Features.Profiles.Contracts;
using Fitness.API.Features.Profiles.Models;
using Fitness.API.Features.Profiles.Utilities;
using Microsoft.AspNetCore.Identity;

namespace Fitness.API.Features.Profiles;

public class ProfileService(IProfileRepository profileRepository, UserManager<AppUser> userManager) : IProfileService
{
    public async Task<Result<ProfileDetailResponse>> GetProfileAsync(Guid userId)
    {
        var profile = await profileRepository.GetByUserIdAsync(userId);
        if (profile == null)
        {
            return ProfileErrors.NotFound;
        }

        var roles = await userManager.GetRolesAsync(profile.User);

        return Result<ProfileDetailResponse>.Success(profile.ToDetailResponse(roles));
    }

    public async Task<Result<IEnumerable<ProfileResponse>>> GetAllUserProfilesAsync(Guid userId)
    {
        var profiles = await profileRepository.GetAllAsync();
        var profileResponses = new List<ProfileResponse>();

        foreach (var profile in profiles)
        {
            if(profile.User.Id == userId) continue; // Skip the current user's profile
            var roles = await userManager.GetRolesAsync(profile.User);
            if (roles.Contains(Roles.Admin)) continue; // Skip admin profiles

            profileResponses.Add(profile.ToResponse(roles));
        }

        return Result<IEnumerable<ProfileResponse>>.Success(profileResponses);
    }

    public async Task<Result<ProfileDetailResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
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
        profile.ExperienceLevel = request.ExperienceLevel is null ? profile.ExperienceLevel : ExperienceLevel.From(request.ExperienceLevel);
        profile.PictureUrl = request.PictureUrl ?? profile.PictureUrl;

        await profileRepository.UpdateAsync(profile);
        var roles = await userManager.GetRolesAsync(profile.User);

        return Result<ProfileDetailResponse>.Success(profile.ToDetailResponse(roles));
    }
}