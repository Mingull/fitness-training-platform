using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.API.Features.Auth.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Auth.Tokens.Contracts;

[Table("refresh_tokens")]
[Index(nameof(Token), IsUnique = true)]
public sealed class RefreshToken
{
    [Key]
    public Guid Id { get; set; }
    [MaxLength(200)]
    public string Token { get; set; }
    public Guid UserId { get; set; }
    public DateTime ExpiresOnUtc { get; set; }
    public AppUser? User { get; set; }
}