using Fitness.API.Core.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Fitness.API.Features.Auth.Utilities;

public static class AuthErrors
{
    public static ApiError ValidationFailed(IDictionary<string, string[]> errors) =>
        new("ValidationFailed", ErrorType.Validation, "Validation failed", "The request body is invalid.", errors);

    public static ApiError UserCreationFailed { get; } =
        new("UserCreationFailed", ErrorType.Validation, "Validation failed", "Could not create the user.");
    public static ApiError DuplicateUsername { get; } =
        new("DuplicateUsername", ErrorType.Conflict, "Conflict", "A user with this username already exists.");
    public static ApiError DuplicateEmail { get; } =
        new("DuplicateEmail", ErrorType.Conflict, "Conflict", "A user with this email already exists.");
    public static ApiError RoleAssignmentFailed { get; } =
        new("RoleAssignmentFailed", ErrorType.InternalError, "Internal Server Error", "Could not assign the user role.");
    public static ApiError InvalidCredentials { get; } =
        new("InvalidCredentials", ErrorType.Unauthorized, "Unauthorized", "Invalid credentials.");
    public static ApiError InvalidRefreshToken { get; } =
        new("InvalidRefreshToken", ErrorType.Unauthorized, "Unauthorized", "The refresh token is invalid or has expired.");
    public static ApiError Unauthorized { get; } =
        new("Unauthorized", ErrorType.Unauthorized, "Unauthorized", "You are not authorized to perform this action.");

    public static ApiError MapUserCreationFailure(IEnumerable<IdentityError> errors)
    {
        var identityErrors = errors.ToArray();

        if (identityErrors.Length == 0)
        {
            return UserCreationFailed;
        }

        if (identityErrors.Any(error => error.Code == nameof(IdentityErrorDescriber.DuplicateUserName)))
        {
            return DuplicateUsername;
        }

        if (identityErrors.Any(error => error.Code == nameof(IdentityErrorDescriber.DuplicateEmail)))
        {
            return DuplicateEmail;
        }

        var passwordErrorCodes = new HashSet<string>
        {
            nameof(IdentityErrorDescriber.PasswordTooShort),
            nameof(IdentityErrorDescriber.PasswordRequiresNonAlphanumeric),
            nameof(IdentityErrorDescriber.PasswordRequiresDigit),
            nameof(IdentityErrorDescriber.PasswordRequiresLower),
            nameof(IdentityErrorDescriber.PasswordRequiresUpper),
            nameof(IdentityErrorDescriber.PasswordRequiresUniqueChars),
        };

        var fieldErrors = new Dictionary<string, List<string>>();

        foreach (var error in identityErrors)
        {
            string key;
            if (error.Code == nameof(IdentityErrorDescriber.InvalidUserName))
                key = "username";
            else if (error.Code == nameof(IdentityErrorDescriber.InvalidEmail))
                key = "email";
            else if (passwordErrorCodes.Contains(error.Code))
                key = "password";
            else
                key = "errors";

            if (!fieldErrors.ContainsKey(key))
                fieldErrors[key] = [];
            fieldErrors[key].Add(error.Description);
        }

        return new ApiError(
            UserCreationFailed.Code,
            ErrorType.Validation,
            "Validation failed",
            "Could not create the user.",
            fieldErrors.ToDictionary(kv => kv.Key, kv => kv.Value.ToArray()));
    }

    public static ApiError MapModelStateValidationFailure(ModelStateDictionary modelState)
    {
        var errors = modelState
            .Where(entry => entry.Value?.Errors.Count > 0)
            .ToDictionary(
                entry => ToCamelCase(entry.Key),
                entry => entry.Value!.Errors
                    .Select(error => string.IsNullOrWhiteSpace(error.ErrorMessage)
                        ? "The field is invalid."
                        : error.ErrorMessage)
                    .ToArray());

        return ValidationFailed(errors);
    }

    private static string ToCamelCase(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return value;
        }

        if (value.Length == 1)
        {
            return value.ToLowerInvariant();
        }

        return char.ToLowerInvariant(value[0]) + value[1..];
    }
}