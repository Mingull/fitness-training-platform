namespace Fitness.API.Features.Profiles.Contracts;

public record UpdateProfileRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Bio { get; set; }
    public string? Goals { get; set; }
    public string? ExperienceLevel { get; set; }
    public string? Picture { get; set; }
}