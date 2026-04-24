namespace PersonalBlog.API.Common.Exceptions;

public class AppException(string message) : Exception(message);

public class NotFoundException(string resource, object key)
    : AppException($"{resource} với id '{key}' không tồn tại.");

public class ValidationException(IEnumerable<string> errors)
    : AppException("Dữ liệu không hợp lệ.")
{
    public IEnumerable<string> Errors { get; } = errors;
}

public class UnauthorizedException(string message = "Không có quyền truy cập.")
    : AppException(message);
