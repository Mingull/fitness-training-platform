using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Exercises.Models;
using Fitness.API.Features.Workouts.Models;

namespace Fitness.API.Features.WorkoutExercises.Models;

[Table("workout_exercises")]
public sealed class WorkoutExercise
{
    [Key]
    public required Guid Id { get; set; }
    public Workout Workout { get; set; } = null!;
    public required Guid WorkoutId { get; set; }
    public Exercise Exercise { get; set; } = null!;
    public required Guid ExerciseId { get; set; }
    public required int Sets { get; set; }
    public required int Reps { get; set; }
    [Column(TypeName = "decimal(10, 2)")]
    public required decimal Weight { get; set; }
    public required int ExerciseOrder { get; set; }
}