using PersonalBlog.API.DTOs.Auth;

namespace PersonalBlog.API.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
}
