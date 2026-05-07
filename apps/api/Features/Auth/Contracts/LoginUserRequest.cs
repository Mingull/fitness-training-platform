using System.ComponentModel.DataAnnotations;

namespace Fitness.API.Features.Auth.Contracts;

public sealed record LoginUserRequest
{
    [Required]
    public string Email { get; init; } = String.Empty;

    [Required]
    public string Password { get; init; } = String.Empty;
}