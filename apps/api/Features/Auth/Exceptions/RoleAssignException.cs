using Microsoft.AspNetCore.Identity;

namespace Fitness.API.Features.Auth.Exceptions;

public class RoleAssignException(string message, IEnumerable<IdentityError> errors, Exception? innerException) : AuthException(message, errors, innerException)
{
    public RoleAssignException(string message, IEnumerable<IdentityError> errors) : this(message, errors, null)
    {
    }
}