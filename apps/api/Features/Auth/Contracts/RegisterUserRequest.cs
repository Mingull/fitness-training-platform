using System.ComponentModel.DataAnnotations;

namespace Fitness.API.Features.Auth.Contracts;

public sealed record RegisterUserRequest
{
    [Required]
    public string FirstName { get; init; } = String.Empty;

    [Required]
    public string LastName { get; init; } = String.Empty;

    [Required]
    public string Username { get; init; } = String.Empty;

    [Required]
    public string Email { get; init; } = String.Empty;

    [Required]
    public string Password { get; init; } = String.Empty;
}