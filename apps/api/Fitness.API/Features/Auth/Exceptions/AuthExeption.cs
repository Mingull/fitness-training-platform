using Microsoft.AspNetCore.Identity;

namespace Fitness.API.Features.Auth.Exceptions;

/// <summary>
/// Base exception for authentication-related errors, encapsulating IdentityError details for better error handling and debugging.
/// </summary>
/// <param name="message"></param>
/// <param name="errors"></param>
/// <param name="innerException"></param>
public class AuthException : Exception
{
    public IEnumerable<IdentityError> Errors { get; }

    public AuthException(string message, IEnumerable<IdentityError> errors, Exception? innerException = null) : base(message, innerException)
    {
        Errors = errors;
    }

    public AuthException(string message) : this(message, Enumerable.Empty<IdentityError>())
    {
    }
}