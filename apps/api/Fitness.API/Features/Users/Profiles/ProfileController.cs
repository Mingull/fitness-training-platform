using Fitness.API.Core.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Fitness.API.Features.Profiles.Abstract;
using Fitness.API.Core.Contracts;
using Fitness.API.Features.Profiles.Contracts;
using Fitness.API.Core.Extensions;

namespace Fitness.API.Features.Users.Profiles;

[ApiController]
[Produces("application/json")]
[Tags("Profiles")]
public class ProfileController(IProfileService profileService) : ControllerBase
{
    [HttpGet("users/me/profile")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetProfile()
    {
        // Read the authenticated user's ID from the claims principal and return that user's profile.
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
        {
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));
        }

        var profile = await profileService.GetProfileAsync(userId.Value);

        if (!profile.IsSuccess)
        {
            var error = profile.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<ProfileResponse>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Profile retrieved successfully",
            Data = profile.Value
        });
    }

    [HttpPatch("users/me/profile")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ProfileResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
        {
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));
        }

        var result = await profileService.UpdateProfileAsync(userId.Value, request);

        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<ProfileResponse>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Profile updated successfully",
            Data = result.Value
        });
    }
}