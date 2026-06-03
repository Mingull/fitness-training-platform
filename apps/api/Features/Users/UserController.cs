using Fitness.API.Core.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Fitness.API.Core.Contracts;
using Fitness.API.Core.Extensions;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Users.Contracts;

namespace Fitness.API.Features.Users;

[ApiController]
[Produces("application/json")]
[Tags("Users")]
public class UserController(IPlanService planService, ILogger<UserController> logger) : ControllerBase
    [HttpGet("users/me/active-plan")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<ActiveUserPlanResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetActivePlan()
    {
        logger.LogInformation("Received request to get active plan for user.");
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
        {
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));
        }

        var result = await planService.GetActivePlanForUserAsync(userId.Value);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<ActiveUserPlanResponse?>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Active plan retrieved successfully",
            Data = result.Value
        });
    }

    [HttpPut("users/me/active-plan")]
    [Authorize]
    public async Task<IActionResult> ActivatePlan([FromBody] SetActivePlanRequest request)
    {
        // Read the authenticated user's ID from the claims principal and return that user's profile.
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
        {
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));
        }

        var result = await planService.ActivatePlanForUserAsync(userId.Value, request.PlanId);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Active plan activated successfully",
        });
    }
    [HttpDelete("users/me/active-plan")]
    [Authorize]
    public async Task<IActionResult> DeactivatePlan()
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
        {
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));
        }

        var result = await planService.DeactivatePlanForUserAsync(userId.Value);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Active plan deactivated successfully",
        });
    }
}