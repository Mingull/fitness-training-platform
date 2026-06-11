using Fitness.API.Core.Contracts;
using Fitness.API.Core.Utilities;
using Fitness.API.Features.Auth.Abstract;
using Fitness.API.Features.Auth.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.API.Features.Auth;

[ApiController]
[Route("auth")]
[Produces("application/json")]
[Tags("Authentication")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("sign-up")]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
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

        return Ok(new ApiResponse
        {
            Status = StatusCodes.Status200OK,
            // Status code has to be set to "Ok" for human readability, even though the HTTP status code is already 200.
            StatusCode = "Ok",
            Message = "User registered successfully",
        });
    }

    [HttpPost("sign-in")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
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

    [HttpPost("refresh")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
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

    [HttpPost("sign-out")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    // This endpoint is for the user to revoke the refresh token that was used to sign in, effectively signing out from the current session.
    // This allows users to have multiple sessions (e.g., on different devices) and only revoke the one they are currently using, without affecting other sessions.
    public async Task<IActionResult> RevokeRefreshToken([FromBody] RefreshTokenRequest request)
    {
        var result = await authService.RevokeRefreshTokenAsync(request.RefreshToken);

        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return result.Value ? Ok(new ApiResponse
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Refresh tokens revoked successfully",
        }) : BadRequest();
    }

    [HttpPost("revoke")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    // This endpoint is for the user to revoke all refresh tokens associated with their account, effectively signing out from all sessions on all devices.
    // This is useful in case of a security breach or if the user simply wants to ensure that they are signed out from everywhere.
    public async Task<IActionResult> RevokeRefreshTokens()
    {
        var result = await authService.RevokeRefreshTokensAsync();

        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return result.Value ? Ok(new ApiResponse
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Refresh tokens revoked successfully",
        }) : BadRequest();
    }
}