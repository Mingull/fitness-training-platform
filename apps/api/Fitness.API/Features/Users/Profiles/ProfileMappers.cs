using Fitness.API.Features.Profiles.Contracts;
using Fitness.API.Features.Profiles.Models;

namespace Fitness.API.Features.Plans;
public static class ProfileMappers
{
    public static ProfileResponse ToResponse(this Profile profile, IList<string> roles)
    {
        return new ProfileResponse
        {
            Id = profile.Id,
            UserId = profile.User.Id,
            Username = profile.User.UserName!,
            Roles = roles,
            FirstName = profile.FirstName!,
            LastName = profile.LastName!,
            ExperienceLevel = profile.ExperienceLevel.Value,
            PictureUrl = profile.PictureUrl
        };
    }

    public static ProfileDetailResponse ToDetailResponse(this Profile profile, IList<string> roles)
    {
        return new ProfileDetailResponse
        {
            Id = profile.Id,
            UserId = profile.User.Id,
            Username = profile.User.UserName!,
            Email = profile.User.Email!,
            Roles = roles,
            FirstName = profile.FirstName!,
            LastName = profile.LastName!,
            ExperienceLevel = profile.ExperienceLevel.Value,
            Bio = profile.Bio,
            Goals = profile.Goals,
            PictureUrl = profile.PictureUrl
        };
    }
}