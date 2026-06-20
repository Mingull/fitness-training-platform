using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Fitness.API.Features.TrainerRequests.Models;

[Table("request_statuses")]
public sealed class RequestStatus
{
    [Key]
    public int Id { get; set; }
    public required string Value { get; set; }
    public required string Label { get; set; }
}