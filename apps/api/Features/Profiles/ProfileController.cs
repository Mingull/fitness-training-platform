using Fitness.API.Core.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Fitness.API.Features.Profiles;

[ApiController]
[Route("profiles")]
[Produces("application/json")]
public class ProfileController() : ControllerBase
{
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetProfile()
    {
        // For now just return the claims of the authenticated user to verify that authentication is working correctly.
        var claimsPrincipal = HttpContext.User;
        var claimsByType = claimsPrincipal.Claims
            .GroupBy(c => c.Type)
            .ToDictionary(g => g.Key, g => g.Select(c => c.Value).ToArray());

        return Ok(claimsByType);
    }
}