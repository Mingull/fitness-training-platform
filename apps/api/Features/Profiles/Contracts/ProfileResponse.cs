namespace Fitness.API.Features.Profiles.Contracts;

public record ProfileResponse
{
    public Guid Id { get; set; }

    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Bio { get; set; }
    public string? Goals { get; set; }
    public string? ExperienceLevel { get; set; }
    public string? PictureUrl { get; set; }
}