using Microsoft.AspNetCore.Identity;
using Fitness.API.Features.Profiles.Models;

namespace Fitness.API.Features.Auth.Models;

public sealed class AppUser : IdentityUser<Guid>
{
    public Profile? Profile { get; set; }
}