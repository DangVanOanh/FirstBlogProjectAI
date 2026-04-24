using System.Text.Json;
using PersonalBlog.API.Common.Exceptions;
using PersonalBlog.API.Common.Models;

namespace PersonalBlog.API.Middleware;

public class ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (NotFoundException ex)
        {
            logger.LogWarning("Resource not found: {Message}", ex.Message);
            await WriteResponse(context, 404, ApiResponse<object>.Fail(ex.Message));
        }
        catch (ValidationException ex)
        {
            logger.LogWarning("Validation failed: {Errors}", string.Join(", ", ex.Errors));
            await WriteResponse(context, 400, ApiResponse<object>.Fail(ex.Errors));
        }
        catch (UnauthorizedException ex)
        {
            await WriteResponse(context, 401, ApiResponse<object>.Fail(ex.Message));
        }
        catch (AppException ex)
        {
            logger.LogWarning("App exception: {Message}", ex.Message);
            await WriteResponse(context, 400, ApiResponse<object>.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception on {Method} {Path}", context.Request.Method, context.Request.Path);
            await WriteResponse(context, 500, ApiResponse<object>.Fail("Lỗi server. Vui lòng thử lại sau."));
        }
    }

    private static async Task WriteResponse<T>(HttpContext context, int statusCode, ApiResponse<T> response)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(response, JsonOptions));
    }
}
