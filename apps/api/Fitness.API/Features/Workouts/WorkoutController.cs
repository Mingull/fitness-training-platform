using Fitness.API.Core.Contracts;
using Fitness.API.Core.Extensions;
using Fitness.API.Core.Utilities;
using Fitness.API.Features.Workouts.Abstract;
using Fitness.API.Features.Workouts.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.API.Features.Workouts;

[ApiController]
[Route("workouts")]
[Produces("application/json")]
[Tags("Workouts")]
public class WorkoutController(IWorkoutService workoutService) : ControllerBase
{
    [HttpGet("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> GetWorkoutByIdAsync([FromRoute] Guid id)
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));

        var result = await workoutService.GetWorkoutByIdAsync(id, userId.Value);

        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<WorkoutDetailResponse>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Workout retrieved successfully",
            Data = result.Value
        });
    }

    [HttpPost("{workoutId:guid}/exercises")]
    [Authorize]
    public async Task<IActionResult> AddExerciseToWorkoutAsync([FromRoute] Guid workoutId, [FromBody] AddExerciseRequest request)
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));

        var result = await workoutService.AddExerciseAsync(workoutId, request, userId.Value);

        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<WorkoutResponse>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Exercise added to workout successfully",
            Data = result.Value
        });
    }
}