using Fitness.API.Abstract.Services;
using Fitness.API.Contexts;
using Fitness.API.Features.Auth.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Auth;

public class AuthRepository(FitnessContext context) : IAuthRepository
{
    public async Task<RefreshToken> AddRefreshTokenAsync(Guid userId, string token, DateTime? expiresAt = null)
    {
        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Token = token,
            ExpiresAt = expiresAt ?? DateTime.UtcNow.AddDays(7)
        };

        context.RefreshTokens.Add(refreshToken);
        await context.SaveChangesAsync();

        return refreshToken;
    }

    public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
    {
        return await context.RefreshTokens.Include(r => r.User).FirstOrDefaultAsync(rt => rt.Token == token);
    }

    public async Task<RefreshToken?> GetValidRefreshTokenAsync(Guid userId, string token)
    {
        return await context.RefreshTokens.FirstOrDefaultAsync(r => r.UserId == userId && r.Token == token && r.RevokedAt == null);
    }
}