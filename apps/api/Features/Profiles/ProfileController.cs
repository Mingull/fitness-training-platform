using Fitness.API.Core.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Fitness.API.Features.Profiles.Abstract;
using Fitness.API.Core.Contracts;
using Fitness.API.Features.Profiles.Contracts;
using Fitness.API.Core.Extensions;

namespace Fitness.API.Features.Profiles;

[ApiController]
[Route("profiles")]
[Produces("application/json")]
public class ProfileController(IProfileService profileService) : ControllerBase
{
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
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
}