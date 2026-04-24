namespace PersonalBlog.API.Common.Models;

public sealed class ApiResponse<T>
{
    public bool Success { get; init; }
    public T? Data { get; init; }
    public string? Message { get; init; }
    public IEnumerable<string>? Errors { get; init; }

    private ApiResponse() { }

    public static ApiResponse<T> Ok(T data, string? message = null) =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponse<T> Fail(string message) =>
        new() { Success = false, Message = message };

    public static ApiResponse<T> Fail(IEnumerable<string> errors) =>
        new() { Success = false, Errors = errors };
}

public static class ApiResponse
{
    public static ApiResponse<object> Ok(string? message = null) =>
        ApiResponse<object>.Ok(new { }, message);

    public static ApiResponse<object> Fail(string message) =>
        ApiResponse<object>.Fail(message);
}
