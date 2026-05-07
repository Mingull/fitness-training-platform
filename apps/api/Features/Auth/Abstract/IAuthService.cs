using Fitness.API.Features.Auth.Contracts;
using Fitness.API.Utilities;

namespace Fitness.API.Abstract.Services;

public interface IAuthService
{
    Task<Result> RegisterAsync(RegisterUserRequest request);
    Task<Result<AuthResponse>> LoginAsync(LoginUserRequest request);
    Task<Result<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request);
}