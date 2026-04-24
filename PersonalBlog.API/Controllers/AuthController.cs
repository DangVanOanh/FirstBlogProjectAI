using Microsoft.AspNetCore.Mvc;
using PersonalBlog.API.Common.Models;
using PersonalBlog.API.DTOs.Auth;
using PersonalBlog.API.Services.Interfaces;

namespace PersonalBlog.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService service) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login(LoginRequest request)
    {
        var result = await service.LoginAsync(request);
        return Ok(ApiResponse<LoginResponse>.Ok(result));
    }
}
