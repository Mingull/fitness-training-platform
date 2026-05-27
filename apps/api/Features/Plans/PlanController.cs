using Fitness.API.Core.Extensions;
using Fitness.API.Core.Utilities;
using Fitness.API.Features.Plans.Abstract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.API.Features.Plans;

[ApiController]
[Route("plans")]
[Produces("application/json")]
[Tags("Training Plans")]
public class PlanController(IPlanService planService) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAllPlansAsync()
    {
        // Read the authenticated user's ID from the claims principal and return that user's profile.
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
        {
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));
        }

        var result = await planService.GetAllPlansAsync(userId.Value);

        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        // Check if there are any plans left after filtering, if not return a NoContent error
        if (!result.Value.Any())
        {
            return NoContent(); // 204 No Content indicates that the request was successful but there is no content to return
        }

        return Ok(new ApiResponse<IEnumerable<PlanResponse>>
        {
            Status = "Success",
            StatusCode = StatusCodes.Status200OK,
            Message = "Plans retrieved successfully.",
            Data = result.Value
        });
    }
}