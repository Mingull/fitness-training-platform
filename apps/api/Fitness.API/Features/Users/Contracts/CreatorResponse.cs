using System.Text.Json.Serialization;

namespace Fitness.API.Features.Users.Contracts;

/// <summary>
/// Generic response contract for user information.
/// Used to represent the creator of a training plan or workout without exposing sensitive information like email or password.
/// </summary>
public record CreatorResponse
{
    public required Guid Id { get; init; }
    public required string Username { get; init; }
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PictureUrl { get; init; }
}