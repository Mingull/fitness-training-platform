using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Fitness.API.Features.Profiles.Models;

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

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Bio { get; set; } = null;
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Goals { get; set; } = null;
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? ExperienceLevel { get; set; } = null;
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PictureUrl { get; set; } = null;
}