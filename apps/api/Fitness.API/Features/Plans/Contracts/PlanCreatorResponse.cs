using System.Text.Json.Serialization;

namespace Fitness.API.Features.Plans.Contracts;

public record PlanCreatorResponse
{
    public required Guid Id { get; set; }
    public required string Username { get; set; }
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PictureUrl { get; set; }
}