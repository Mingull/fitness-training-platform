using Fitness.API.Core.Contexts;
using Fitness.API.Core.Utilities;
using Fitness.API.Features.Auth.Contracts;
using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.Profiles.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Fitness.API.Features.Auth.Abstract;
using Fitness.API.Features.Auth.Utilities;
using System.IdentityModel.Tokens.Jwt;
using Fitness.API.Features.Profiles.Abstract;

namespace Fitness.API.Features.Auth;

public class AuthService(UserManager<AppUser> userManager, FitnessContext context, IAuthRepository authRepo, IProfileRepository profileRepo, TokenProvider tokenProvider, IHttpContextAccessor httpContextAccessor) : IAuthService
{
    public async Task<Result> RegisterAsync(RegisterUserRequest request)
    {
        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            var user = new AppUser
            {
                Id = Guid.CreateVersion7(),
                UserName = request.Username,
                Email = request.Email,
            };
            if (!Base64ImageValidator.TryNormalizeImageBase64(
                request.Picture,
                2 * 1024 * 1024,
                out var normalizedPicture,
                out var pictureError))
            {
                return AuthErrors.InvalidProfilePicture(pictureError!);
            }

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

            await profileRepo.CreateAsync(new Profile
            {
                Id = Guid.CreateVersion7(),
                UserId = user.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                // Optional fields
                Bio = request.Bio,
                ExperienceLevel = ExperienceLevel.From(request.ExperienceLevel),
                Goals = request.Goals,
                PictureUrl = normalizedPicture
            });

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
            return AuthErrors.InvalidCredentials;

        var roles = await userManager.GetRolesAsync(user);

        var accessToken = tokenProvider.CreateAccessToken(user, roles);

        var refreshToken = tokenProvider.CreateRefreshToken();
        var tokenHash = TokenProvider.HashRefreshToken(refreshToken);
        await authRepo.AddRefreshTokenAsync(user.Id, tokenHash);

        return Result<AuthResponse>.Success(new AuthResponse { AccessToken = accessToken, RefreshToken = refreshToken });
    }

    public async Task<Result<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var refreshToken = await authRepo.GetRefreshTokenAsync(TokenProvider.HashRefreshToken(request.RefreshToken));
        if (refreshToken is null || refreshToken.ExpiresAt < DateTime.UtcNow || refreshToken.RevokedAt != null)
            return AuthErrors.InvalidRefreshToken;

        string accessToken = tokenProvider.CreateAccessToken(refreshToken.User!, await userManager.GetRolesAsync(refreshToken.User!));

        var newRefreshToken = tokenProvider.CreateRefreshToken();
        var newTokenHash = TokenProvider.HashRefreshToken(newRefreshToken);

        await using var transaction = await context.Database.BeginTransactionAsync();
        var currentUtc = DateTime.UtcNow;

        var revokedTokens = await authRepo.RevokeRefreshTokenAsync(refreshToken.Id, currentUtc);
        if (revokedTokens == 0)
            return AuthErrors.InvalidRefreshToken;

        await authRepo.AddRefreshTokenAsync(refreshToken.UserId, newTokenHash, currentUtc.AddDays(7));
        await transaction.CommitAsync();

        return Result<AuthResponse>.Success(new AuthResponse { AccessToken = accessToken, RefreshToken = newRefreshToken });
    }

    public async Task<Result<bool>> RevokeRefreshTokenAsync(string refreshToken)
    {
        var userId = GetCurrentUserId();

        if (userId is null) return AuthErrors.Unauthorized;

        var tokenHash = TokenProvider.HashRefreshToken(refreshToken);
        var token = await authRepo.GetValidRefreshTokenAsync(userId.Value, tokenHash);

        if (token is null) return AuthErrors.InvalidRefreshToken;

        token.RevokedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        return Result<bool>.Success(true);
    }

    private Guid? GetCurrentUserId()
    {
        var principal = httpContextAccessor.HttpContext?.User;
        var userIdValue = principal?.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? principal?.FindFirstValue(JwtRegisteredClaimNames.Sub);

        return Guid.TryParse(userIdValue, out var parsed) ? parsed : null;
    }

    public async Task<Result<bool>> RevokeRefreshTokensAsync()
    {
        var userId = GetCurrentUserId();

        if (userId is null) return AuthErrors.Unauthorized;

        var userRefreshTokens = await authRepo.GetAllRefreshTokensAsync(userId.Value);

        foreach (var token in userRefreshTokens) token.RevokedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        return Result<bool>.Success(true);
    }
}
