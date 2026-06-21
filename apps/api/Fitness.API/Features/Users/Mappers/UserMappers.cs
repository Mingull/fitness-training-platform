using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Profiles.Models;
using Fitness.API.Features.Users.Contracts;

namespace Fitness.API.Features.Users.Mappers;

public static class UserMapper
{
    public static UserResponse ToResponse(this AppUser entity)
    {
        var profile = entity.Profile;
        return new UserResponse
        {
            Id = entity.Id,
            Username = entity.UserName!,
            FirstName = profile?.FirstName ?? string.Empty,
            LastName = profile?.LastName ?? string.Empty,
            PictureUrl = profile?.PictureUrl
        };
    }
}