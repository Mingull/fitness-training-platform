using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Auth.Models;
using Fitness.API.Features.TrainerRequests.Contracts;

namespace Fitness.API.Features.TrainerRequests.Models;

[Table("trainer_requests")]
public sealed class TrainerRequest
{
    [Key]
    public Guid Id { get; set; }
    public AppUser Athlete { get; set; } = null!;
    public Guid AthleteId { get; set; }
    public AppUser Trainer { get; set; } = null!;
    public Guid TrainerId { get; set; }
    public RequestStatus Status { get; set; } = null!;
    public required int StatusId { get; set; }
    public string? Message { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public DateTimeOffset? DeletedAt { get; set; }
}