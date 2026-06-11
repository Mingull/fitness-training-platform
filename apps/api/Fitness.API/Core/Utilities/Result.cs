namespace Fitness.API.Core.Utilities;

public record Result
{
    public bool IsSuccess { get; }
    public ApiError? Error { get; }

    protected Result(bool isSuccess, ApiError? error)
    {
        IsSuccess = isSuccess;
        Error = error;
    }

    public static Result Success() => new(true, null);
    public static Result Failure(ApiError error) => new(false, error ?? throw new ArgumentNullException(nameof(error)));

    public static implicit operator Result(ApiError error) => Failure(error);
}

public record Result<T> : Result
{
    public T Value => IsSuccess
     ? _value!
     : throw new InvalidOperationException("Cannot access value of a failure result.");

    private readonly T? _value;

    private Result(T value) : base(true, null) => _value = value;
    private Result(ApiError error) : base(false, error) => _value = default;

    public static Result<T> Success(T value) => new(value);

    public static implicit operator Result<T>(T value) => new(value);

    public static implicit operator Result<T>(ApiError error) => new(error);
}