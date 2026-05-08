using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.API.Core.Utilities;

public class ApiError : ProblemDetails
{
    public string Code { get; init; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IDictionary<string, string[]>? Errors { get; init; }

    public ApiError(string code, ErrorType type, string title, string detail, IDictionary<string, string[]>? errors = null, string? instance = null)
    {
        Code = code;
        Status = ToStatusCode(type);
        Title = title;
        Detail = detail;
        Type = $"https://httpstatuses.com/{Status}";
        Instance = instance;
        Errors = errors is null ? null : new Dictionary<string, string[]>(errors);
    }

    private static int ToStatusCode(ErrorType type) => type switch
    {
        ErrorType.Validation => StatusCodes.Status400BadRequest,
        ErrorType.Unauthorized => StatusCodes.Status401Unauthorized,
        ErrorType.Forbidden => StatusCodes.Status403Forbidden,
        ErrorType.NotFound => StatusCodes.Status404NotFound,
        ErrorType.Conflict => StatusCodes.Status409Conflict,
        _ => StatusCodes.Status500InternalServerError,
    };
}