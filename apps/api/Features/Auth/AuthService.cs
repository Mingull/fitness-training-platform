using Fitness.API.Contexts;
using Fitness.API.Abstract.Services;
using Fitness.API.Utilities;
using Fitness.API.Utilities.Errors;
using Fitness.API.Features.Auth.Contracts;
using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Profiles.Models;
using Microsoft.AspNetCore.Identity;
using Fitness.API.Core.Tokens;
using Fitness.API.Features.Auth.Tokens.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Auth;

public class AuthService(UserManager<AppUser> userManager, FitnessContext context, TokenProvider tokenProvider) : IAuthService
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

    public async Task<Result<AuthResponse>> LoginAsync(LoginUserRequest request)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user is null || !await userManager.CheckPasswordAsync(user, request.Password))
        {
            return AuthErrors.InvalidCredentials;
        }

        var roles = await userManager.GetRolesAsync(user);

        var accessToken = tokenProvider.CreateAccessToken(user, roles);

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = tokenProvider.CreateRefreshToken(),
            ExpiresOnUtc = DateTime.UtcNow.AddDays(7)
        };

        context.RefreshTokens.Add(refreshToken);
        await context.SaveChangesAsync();

        return Result<AuthResponse>.Success(new AuthResponse { AccessToken = accessToken, RefreshToken = refreshToken.Token });
    }

    public async Task<Result<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var refreshToken = await context.RefreshTokens
                                    .Include(r => r.User)
                                    .FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken);
        if (refreshToken is null || refreshToken.ExpiresOnUtc < DateTime.UtcNow)
            return AuthErrors.InvalidRefreshToken;

        string accessToken = tokenProvider.CreateAccessToken(refreshToken.User!, await userManager.GetRolesAsync(refreshToken.User!));

        refreshToken.Token = tokenProvider.CreateRefreshToken();
        refreshToken.ExpiresOnUtc = DateTime.UtcNow.AddDays(7);

        await context.SaveChangesAsync();

        return Result<AuthResponse>.Success(new AuthResponse { AccessToken = accessToken, RefreshToken = refreshToken.Token });
    }
}