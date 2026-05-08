namespace Fitness.Api.Contracts;

public record ApiResponse
{
    /// <summary>
    /// HTTP status code of the response, indicating the result of the API call (e.g., 200 for success, 400 for bad request, etc.).
    /// </summary>
    public required int Status { get; init; }
    /// <summary>
    /// A string representation of the HTTP status code, providing a more human-readable format for the status (e.g., "Ok" for success, "Bad Request" for bad request, etc.).
    /// </summary>
    public required string StatusCode { get; init; }
    /// <summary>
    /// A descriptive message providing additional information about the response, which can be useful for debugging and understanding the outcome of the API call.
    /// </summary>
    public required string Message { get; init; }
}

public record ApiResponse<T>
{
    /// <summary>
    /// HTTP status code of the response, indicating the result of the API call (e.g., 200 for success, 400 for bad request, etc.).
    /// </summary>
    public required int Status { get; init; }
    /// <summary>
    /// A string representation of the HTTP status code, providing a more human-readable format for the status (e.g., "Ok" for success, "Bad Request" for bad request, etc.).
    /// </summary>
    public required string StatusCode { get; init; }
    /// <summary>
    /// A descriptive message providing additional information about the response, which can be useful for debugging and understanding the outcome of the API call.
    /// </summary>
    public required string Message { get; init; }
    /// <summary>
    /// The actual data payload of the response, which can be of any type (generic T) depending on the context of the API call. This allows for flexibility in returning different types of data while maintaining a consistent response structure.
    /// </summary>
    public T Data { get; init; } = default!;
}
