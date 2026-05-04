namespace Fitness.API.Features.Auth.Contracts;

public record AuthResponse
{
    public required string AccessToken { get; init; }
    public required string RefreshToken { get; init; }
}