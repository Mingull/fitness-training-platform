using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Plans.Models;
using Fitness.API.Features.WorkoutExercises.Models;

namespace Fitness.API.Features.Workouts.Models;

[Table("workouts")]
public sealed class Workout
{
    [Key]
    public Guid Id { get; set; }
    public Plan Plan { get; set; } = null!;
    public Guid PlanId { get; set; }
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;
    public int Order { get; set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public DateTime? DeletedAt { get; private set; }
    public ICollection<WorkoutExercise> WorkoutExercises { get; set; } = [];
}