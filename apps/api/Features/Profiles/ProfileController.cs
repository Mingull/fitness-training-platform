using Fitness.API.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Fitness.API.Features.Profiles;

[ApiController]
[Route("profiles")]
[Produces("application/json")]
public class ProfileController() : ControllerBase
{
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    [Authorize]
    public async Task<IActionResult> GetProfile()
    {
        // For now just return the claims of the authenticated user to verify that authentication is working correctly.
        var claimsPrincipal = HttpContext.User;
        return Ok(claimsPrincipal.Claims.ToDictionary(c => c.Type, c => c.Value));
    }
}