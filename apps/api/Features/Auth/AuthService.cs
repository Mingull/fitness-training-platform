using Fitness.API.Contexts;
using Microsoft.AspNetCore.Identity;
using Fitness.API.Abstract.Services;
using Fitness.API.Utilities;
using Fitness.API.Utilities.Errors;
using Fitness.API.Features.Auth.Contracts;
using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Profiles.Models;

namespace Fitness.API.Features.Auth;

public class AuthService(UserManager<AppUser> userManager, FitnessContext context) : IAuthService
{
    public async Task<Result> RegisterAsync(RegisterUserRequest request)
    {
        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            var user = new AppUser
            {
                UserName = request.Username,
                Email = request.Email,
            };

            var createUserResult = await userManager.CreateAsync(user, request.Password);

            if (!createUserResult.Succeeded)
            {
                return AuthErrors.MapUserCreationFailure(createUserResult.Errors);
            }

            var assignRoleResult = await userManager.AddToRoleAsync(user, Roles.Sporter);

            if (!assignRoleResult.Succeeded)
            {
                return AuthErrors.RoleAssignmentFailed;
            }

            var profile = new Profile
            {
                UserId = user.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Bio = null,
                ExperienceLevel = null,
                Goals = null
            };

            context.Profiles.Add(profile);
            await context.SaveChangesAsync();

            await transaction.CommitAsync();
            return Result.Success();
        }
        catch
        {
            await transaction.RollbackAsync();
            return AuthErrors.UserCreationFailed;
        }
    }
}