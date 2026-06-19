using Fitness.API.Core.Contracts;
using Fitness.API.Core.Extensions;
using Fitness.API.Core.Utilities;
using Fitness.API.Features.Devices.Abstract;
using Fitness.API.Features.Devices.Contracts;
using Fitness.API.Features.Devices.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.API.Features.Devices;

[ApiController]
[Route("devices")]
public class DeviceController(IDeviceService deviceService) : ControllerBase
{
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<DeviceResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> RegisterDevice([FromBody] RegisterDeviceRequest request)
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));
            
        if (!Enum.TryParse<DevicePlatform>(request.Platform, true, out var platform))
        {
            return BadRequest(new ApiError("InvalidPlatform", ErrorType.BadRequest, "Invalid platform", "The provided platform is invalid."));
        }
        var result = await deviceService.RegisterDeviceAsync(userId.Value, request.ExpoToken, platform);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse<DeviceResponse>
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Device registered successfully",
            Data = result.Value
        });
    }

    [HttpDelete("{expoToken}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ApiError), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeactivateDevice([FromRoute] string expoToken)
    {
        var userId = this.UserIdFromJwt();
        if (!userId.HasValue)
            return Unauthorized(new ApiError("InvalidToken", ErrorType.Unauthorized, "Invalid token", "The provided token is invalid."));

        var result = await deviceService.DeactivateDeviceAsync(userId.Value, expoToken);
        if (!result.IsSuccess)
        {
            var error = result.Error!;
            return StatusCode(error.Status ?? StatusCodes.Status500InternalServerError, error);
        }

        return Ok(new ApiResponse
        {
            Status = StatusCodes.Status200OK,
            StatusCode = "Ok",
            Message = "Device unregistered successfully"
        });
    }
}
