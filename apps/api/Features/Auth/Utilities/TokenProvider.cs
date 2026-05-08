using System.Security.Claims;
using System.Text;
using Fitness.API.Features.Auth.Models;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Cryptography;
using Microsoft.Extensions.Options;
using Fitness.API.Core;

namespace Fitness.API.Features.Auth.Utilities;

public sealed class TokenProvider(IOptions<JwtOptions> options) 
{
    public string CreateAccessToken(AppUser user, IList<string> roles)
    {
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Value.SecretKey));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        List<Claim> claims = [
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            ..roles.Select(r=>new Claim(ClaimTypes.Role, r))
        ];

        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(options.Value.ExpirationInMinutes),
            SigningCredentials = credentials,
            Issuer = options.Value.Issuer,
            Audience = options.Value.Audience
        };

        var handler = new JsonWebTokenHandler();

        return handler.CreateToken(descriptor);
    }

    public string CreateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
    }
}