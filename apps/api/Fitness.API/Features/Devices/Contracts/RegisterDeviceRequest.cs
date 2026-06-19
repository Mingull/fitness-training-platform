namespace Fitness.API.Features.Devices.Contracts;

public record RegisterDeviceRequest
{
    public required string ExpoToken { get; init; }
    public required string Platform { get; init; }
}