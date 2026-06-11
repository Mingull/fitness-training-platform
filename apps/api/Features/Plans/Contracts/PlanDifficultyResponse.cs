namespace Fitness.API.Features.Plans.Contracts;

public record PlanDifficultyResponse(int Level, string Label)
{
    public static PlanDifficultyResponse FromLevel(int level)
    {
        return level switch
        {
            <= 20 => new PlanDifficultyResponse(level, "beginner"),
            <= 40 => new PlanDifficultyResponse(level, "novice"),
            <= 60 => new PlanDifficultyResponse(level, "intermediate"),
            <= 80 => new PlanDifficultyResponse(level, "advanced"),
            _ => new PlanDifficultyResponse(level, "expert"),
        };
    }
}