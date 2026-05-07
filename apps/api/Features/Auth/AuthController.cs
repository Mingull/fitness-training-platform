using Fitness.API.Abstract.Services;
using Fitness.API.Features.Auth.Contracts;
using Fitness.API.Utilities;
using Microsoft.AspNetCore.Mvc;
using Fitness.Api.Contracts;

namespace Fitness.API.Features.Auth;

[ApiController]
[Route("auth")]
[Produces("application/json")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("sign-up")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status409Conflict)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
    {
        var result = await authService.RegisterAsync(request);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<AuthResponse>
        {
            Status = StatusCodes.Status200OK,
            // Status code has to be set to "Ok" for human readability, even though the HTTP status code is already 200.
            StatusCode = "Ok",
            Message = "User registered successfully",
            Data = new AuthResponse { AccessToken = "sample-jwt-token", RefreshToken = "sample-refresh-token" }
        });
    }

    [HttpPost("sign-in")]
    public async Task<IActionResult> Login([FromBody] LoginUserRequest request)
    {
        var result = await authService.LoginAsync(request);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<AuthResponse>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "User logged in successfully",
            Data = result.Value
        });
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var result = await authService.RefreshTokenAsync(request);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<AuthResponse>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Token refreshed successfully",
            Data = result.Value
        });
    }
}