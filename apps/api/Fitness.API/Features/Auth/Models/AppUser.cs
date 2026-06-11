using Fitness.API.Features.Profiles.Models;
using Microsoft.AspNetCore.Identity;

namespace Fitness.API.Features.Auth.Models;

public sealed class AppUser : IdentityUser<Guid>
{
    public Profile? Profile { get; set; }
}