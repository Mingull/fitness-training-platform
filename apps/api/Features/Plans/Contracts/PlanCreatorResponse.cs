using System.Text.Json.Serialization;

namespace Fitness.API.Features.Plans.Contracts;

public record PlanCreatorResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? PictureUrl { get; set; }
}