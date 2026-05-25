namespace Fitness.API.Features.Profiles.Models;

public class ExperienceLevel : IEquatable<ExperienceLevel>
{
    public static readonly ExperienceLevel Beginner = new("beginner", "Beginner");
    public static readonly ExperienceLevel Intermediate = new("intermediate", "Intermediate");
    public static readonly ExperienceLevel Advanced = new("advanced", "Advanced");
    public static readonly ExperienceLevel Professional = new("professional", "Professional");

    private readonly string _value;
    private readonly string _label;
    private ExperienceLevel(string value, string label) => (_value, _label) = (value, label);

    public string Value => _value;
    public string Label => _label;

    public bool Equals(ExperienceLevel? other) => ReferenceEquals(this, other) || (other is not null && _value == other._value);
    public override bool Equals(object? obj) => Equals(obj as ExperienceLevel);

    public override string ToString() => _value;
    public override int GetHashCode() => _value.GetHashCode();

    public static ExperienceLevel From(string? value)
    {
        return value?.ToLower() switch
        {
            "beginner" => Beginner,
            "intermediate" => Intermediate,
            "advanced" => Advanced,
            "professional" => Professional,
            _ => Beginner
        };
    }
}