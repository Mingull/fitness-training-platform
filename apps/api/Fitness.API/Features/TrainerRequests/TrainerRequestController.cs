using Fitness.API.Core.Contracts;
using Fitness.API.Core.Extensions;
using Fitness.API.Core.Utilities;
using Fitness.API.Features.TrainerRequests.Abstract;
using Fitness.API.Features.TrainerRequests.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.API.Features.TrainerRequests;

[ApiController]
[Route("trainer-requests")]
[Produces("application/json")]
[Tags("TrainerRequests")]
public class TrainerRequestController(ITrainerRequestService trainerRequestService) : ControllerBase
{
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<TrainerRequestResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> CreateTrainerRequestAsync([FromBody] CreateTrainerRequestRequest request)
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));

        var result = await trainerRequestService.CreateRequestAsync(userId.Value, request);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<TrainerRequestResponse>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Trainer request created successfully",
            Data = result.Value
        });
    }
}
