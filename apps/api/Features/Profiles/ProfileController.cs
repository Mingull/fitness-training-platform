using Fitness.API.Core.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Fitness.API.Features.Profiles.Abstract;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Fitness.API.Core.Contracts;
using Fitness.API.Features.Profiles.Contracts;

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
        var claimsPrincipal = HttpContext.User;
        var userIdClaim = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? claimsPrincipal.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var userId = Guid.TryParse(userIdClaim, out var parsedUserId) ? parsedUserId : (Guid?)null;
        if (!userId.HasValue)
        {
            return Unauthorized(
                new ApiError(
                    code: "InvalidToken",
                    type: ErrorType.Unauthorized,
                    title: "Invalid token",
                    detail: "The provided token is invalid."));
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