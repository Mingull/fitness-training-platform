using System.Text.Json.Serialization;
using Fitness.API.Features.Profiles.Models;

namespace Fitness.API.Features.Profiles.Contracts;

public record ProfileResponse
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public required string Username { get; set; }
    public required string Email { get; set; }
    public required IList<string> Roles { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string ExperienceLevel { get; set; }
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Bio { get; set; }
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Goals { get; set; }
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PictureUrl { get; set; }
}