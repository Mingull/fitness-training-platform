using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.API.Core.Extensions;

public static class UserIdFromJwtExtensions
{
    /// <summary>
    /// Extension method for ControllerBase to extract the user ID from the JWT token in the HttpContext.
    /// </summary>
    /// <param name="base"></param>
    /// <returns></returns>
    public static Guid? UserIdFromJwt(this ControllerBase @base)
    {
        // Get the claims principal from the HttpContext
        var claimsPrincipal = @base.HttpContext.User;
        // Try to find the user ID claim (using both the standard "sub" claim and the NameIdentifier claim for compatibility)
        var userIdClaim = claimsPrincipal.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        // If the claim is not found or cannot be parsed as a GUID, return null
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return null;
        }
        return userId;
    }
}