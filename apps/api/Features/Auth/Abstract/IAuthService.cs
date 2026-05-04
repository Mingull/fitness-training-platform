using Fitness.API.Features.Auth.Contracts;
using Fitness.API.Utilities;

namespace Fitness.API.Abstract.Services;

public interface IAuthService
{
    Task<Result> RegisterAsync(RegisterUserRequest request);
}