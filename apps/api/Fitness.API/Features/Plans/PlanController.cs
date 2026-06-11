using Fitness.API.Core.Contracts;
using Fitness.API.Core.Extensions;
using Fitness.API.Core.Utilities;
using Fitness.API.Features.Plans.Abstract;
using Fitness.API.Features.Plans.Contracts;
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
    [AllowAnonymous]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<PlanResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllPlansAsync(
        // The query parameters below are not currently used but are needed in the future when implementing pagination, filtering and sorting.
        [FromQuery] int? limit = 20,
        [FromQuery] Guid? cursor = null,
        [FromQuery] bool? includeCreator = false,
        [FromQuery] string? query = null,
        [FromQuery] bool? includePrivate = false,
        [FromQuery] string? sort = "[\'createdAt\', \'desc\']")
    {
        // Read the authenticated user's ID from the claims principal and return that user's training plans.
        var userId = this.UserIdFromJwt();

        var result = await planService.GetAllPlansAsync(userId);

        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<IEnumerable<PlanResponse>>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Training plans retrieved successfully",
            Data = result.Value
        });
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPlanByIdAsync([FromRoute] Guid id)
    {
        var userId = this.UserIdFromJwt();

        var result = await planService.GetPlanByIdAsync(id, userId);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<PlanResponse>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Training plan retrieved successfully",
            Data = result.Value
        });
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<PlanResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreatePlanAsync([FromBody] CreatePlanRequest request)
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
        {
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));
        }

        var result = await planService.CreatePlanAsync(request, userId.Value);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<PlanResponse>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Training plan created successfully",
            Data = result.Value
        });
    }
}