namespace Fitness.API.Core;

public class JwtOptions
{
    public string Issuer { get; set; } = String.Empty;
    public string Audience { get; set; } = String.Empty;
    public int ExpirationInMinutes { get; set; }
    public string SecretKey { get; set; } = String.Empty;
}