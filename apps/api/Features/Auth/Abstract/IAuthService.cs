using Fitness.API.Features.Auth.Contracts;
using Fitness.API.Core.Utilities;

namespace Fitness.API.Features.Auth.Abstract;

public interface IAuthService
{
    /// <summary>
    /// Registers a new user with the provided details.
    /// </summary>
    /// <param name="request"></param>
    /// <returns>Returns a Result indicating success or failure, along with an appropriate error message if registration fails.</returns>
    Task<Result> RegisterAsync(RegisterUserRequest request);
    /// <summary>
    /// Authenticates a user with the provided credentials.
    /// If authentication fails, returns a Result with an appropriate error message.
    /// </summary>
    /// <param name="request"></param>
    /// <returns>If successful, returns a Result containing an AuthResponse with access and refresh tokens.</returns>
    Task<Result<AuthResponse>> LoginAsync(LoginUserRequest request);
    /// <summary>
    /// Refreshes the access token using a valid refresh token. If the refresh token is valid and not revoked.
    /// </summary>
    /// <param name="request"></param>
    /// <returns>Returns a Result containing a new AuthResponse with a new access token and refresh token.</returns>
    Task<Result<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request);
    /// <summary>
    /// Revokes a specific refresh token, preventing it from being used to obtain new access tokens.
    /// </summary>
    /// <param name="refreshToken"></param>
    /// <returns>Returns a Result indicating whether the revocation was successful or if the token was not found.</returns>
    Task<Result<bool>> RevokeRefreshTokenAsync(string refreshToken);
    /// <summary>
    /// Revokes all refresh tokens associated with the currently authenticated user, effectively logging them out from all sessions.
    /// </summary>
    /// <returns>Returns a Result indicating whether the revocation was successful or if the token was not found.</returns>
    Task<Result<bool>> RevokeRefreshTokensAsync();
}