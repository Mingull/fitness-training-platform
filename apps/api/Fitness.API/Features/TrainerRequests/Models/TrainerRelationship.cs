using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Auth.Models;

namespace Fitness.API.Features.TrainerRequests.Models;

[Table("trainer_relationships")]
public sealed class TrainerRelationship
{
    [Key]
    public Guid Id { get; set; }
    public AppUser Athlete { get; set; } = null!;
    public Guid AthleteId { get; set; }
    public AppUser Trainer { get; set; } = null!;
    public Guid TrainerId { get; set; }
    public DateTimeOffset StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
}