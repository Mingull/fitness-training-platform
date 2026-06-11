using Fitness.API.Features.Auth.Models;
using Microsoft.AspNetCore.Identity;

namespace Fitness.API.Core.Contexts;

public static class IdentitySeeder
{
    public static async Task SeedRoles(RoleManager<IdentityRole<Guid>> roleManager)
    {
        foreach (var role in Roles.All)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }
    }
}