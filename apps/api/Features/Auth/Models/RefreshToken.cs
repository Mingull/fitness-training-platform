using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Fitness.API.Features.Auth.Models;

[Table("refresh_tokens")]
[Index(nameof(TokenHash), IsUnique = true)]
public sealed class RefreshToken
{
    [Key]
    public Guid Id { get; set; }
    [MaxLength(64)]
    public string TokenHash { get; set; } = default!;
    public Guid UserId { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public AppUser? User { get; set; }

    public void SetToken(string token)
    {
        TokenHash = HashToken(token);
    }

    public bool MatchesToken(string token)
    {
        return TokenHash == HashToken(token);
    }

    private static string HashToken(string token)
    {
        var bytes = Encoding.UTF8.GetBytes(token);
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash);
    }
}