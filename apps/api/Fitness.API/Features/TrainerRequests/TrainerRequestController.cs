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
    public async Task<IActionResult> CreateTrainerRequestAsync([FromBody] RequestTrainerRequest request)
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

    [HttpPost("{requestId:guid}/accept")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AcceptTrainerRequestAsync([FromRoute] Guid requestId)
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));

        var result = await trainerRequestService.AcceptRequestAsync(userId.Value, requestId);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Trainer request accepted successfully",
        });
    }

    [HttpPost("{requestId:guid}/reject")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RejectTrainerRequestAsync([FromRoute] Guid requestId)
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));

        var result = await trainerRequestService.RejectRequestAsync(userId.Value, requestId);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Trainer request rejected successfully",
        });
    }

    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<TrainerRequestResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetTrainerRequestsAsync()
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));

        var result = await trainerRequestService.GetAllRequestsForTrainerAsync(userId.Value);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<IEnumerable<TrainerRequestResponse>>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Trainer request status retrieved successfully",
            Data = result.Value
        });
    }

    [HttpGet("{requestId:guid}/status")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<TrainerRequestResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetTrainerRequestStatusAsync([FromRoute] Guid requestId)
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));

        var result = await trainerRequestService.GetRequestStatusAsync(userId.Value, requestId);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<TrainerRequestResponse>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Trainer request status retrieved successfully",
            Data = result.Value
        });
    }
}
