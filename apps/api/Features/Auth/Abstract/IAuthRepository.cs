using Fitness.API.Features.Auth.Models;

namespace Fitness.API.Abstract.Services;

public interface IAuthRepository
{
    /// <summary>
    /// Adds a new refresh token for the specified user. If expiresAt is not provided, it defaults to 7 days from now.
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="token"></param>
    /// <param name="expiresAt"></param>
    /// <returns></returns>
    Task<RefreshToken> AddRefreshTokenAsync(Guid userId, string token, DateTime? expiresAt = null);
    /// <summary>
    /// Retrieves a refresh token by its token string, including the associated user. Returns null if not found.
    /// </summary>
    /// <param name="token"></param>
    /// <returns></returns>
    Task<RefreshToken?> GetRefreshTokenAsync(string token);
    /// <summary>
    /// Retrieves a valid (not revoked) refresh token for the specified user and token string. Returns null if not found or revoked.
    /// It checks that the token belongs to the user, matches the provided token string, and has not been revoked.
    /// It does not check for expiration, as the service layer can handle that logic separately, allowing for more flexible token management (e.g., allowing expired tokens to be revoked).
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="token"></param>
    /// <returns></returns>
    Task<RefreshToken?> GetValidRefreshTokenAsync(Guid userId, string token);
}