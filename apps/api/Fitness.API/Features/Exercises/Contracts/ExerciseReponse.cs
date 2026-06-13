namespace Fitness.API.Features.Exercises.Contracts;

public record ExerciseResponse
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public int Sets { get; init; }
    public int Reps { get; init; }
    public decimal Weight { get; init; }
    public string? MediaUrl { get; init; }
    public int Order { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public DateTime? DeletedAt { get; init; }
}
