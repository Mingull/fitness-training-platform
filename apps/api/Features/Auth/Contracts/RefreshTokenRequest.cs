using System.ComponentModel.DataAnnotations;

namespace Fitness.API.Features.Auth.Contracts;

public sealed record RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; init; } = String.Empty;
}