namespace Fitness.API.Features.Devices.Contracts;

public record DeviceResponse
{
    public required Guid Id { get; init; }
    public required string ExpoToken { get; init; }
    public required string Platform { get; init; }
    public required bool IsActive { get; init; }
    public required DateTimeOffset LastActiveAt { get; init; }
    public required DateTimeOffset CreatedAt { get; init; }
    public DateTimeOffset? UpdatedAt { get; init; }
}