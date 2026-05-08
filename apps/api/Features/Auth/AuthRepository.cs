using Fitness.API.Contexts;
using Fitness.API.Features.Auth.Abstract;
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
            TokenHash = token,
            ExpiresAt = expiresAt ?? DateTime.UtcNow.AddDays(7)
        };

        context.RefreshTokens.Add(refreshToken);
        await context.SaveChangesAsync();

        return refreshToken;
    }

    public async Task<RefreshToken?> GetRefreshTokenAsync(string token)
    {
        return await context.RefreshTokens.Include(r => r.User).FirstOrDefaultAsync(rt => rt.TokenHash == token);
    }

    public async Task<RefreshToken?> GetValidRefreshTokenAsync(Guid userId, string token)
    {
        return await context.RefreshTokens.FirstOrDefaultAsync(r => r.UserId == userId && r.TokenHash == token && r.RevokedAt == null);
    }

    public async Task<List<RefreshToken>> GetAllRefreshTokensAsync(Guid userId)
    {
        return await context.RefreshTokens.Where(r => r.UserId == userId && r.RevokedAt == null).ToListAsync();
    }

    public async Task<bool> TryRotateRefreshTokenAsync(Guid refreshTokenId, Guid userId, string newTokenHash, DateTime currentUtc)
    {
        await using var transaction = await context.Database.BeginTransactionAsync();

        var revokedRows = await context.RefreshTokens
            .Where(rt => rt.Id == refreshTokenId && rt.RevokedAt == null && rt.ExpiresAt >= currentUtc)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(rt => rt.RevokedAt, currentUtc));

        if (revokedRows == 0)
            return false;

        context.RefreshTokens.Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            TokenHash = newTokenHash,
            ExpiresAt = currentUtc.AddDays(7)
        });

        await context.SaveChangesAsync();
        await transaction.CommitAsync();

        return true;
    }

}
