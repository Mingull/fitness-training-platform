using System.Text.Json.Serialization;

namespace Fitness.API.Features.Users.Contracts;

/// <summary>
/// Generic response contract for user information.
/// Used to represent a user without exposing sensitive information like email or password.
/// </summary>
public record UserResponse
{
    public required Guid Id { get; init; }
    public required string Username { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PictureUrl { get; init; }
}