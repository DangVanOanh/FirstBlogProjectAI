using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PersonalBlog.API.Common.Exceptions;
using PersonalBlog.API.Data;
using PersonalBlog.API.DTOs.Auth;
using PersonalBlog.API.Services.Interfaces;

namespace PersonalBlog.API.Services.Implementations;

public class AuthService(AppDbContext db, IConfiguration config) : IAuthService
{
    public async Task<LoginResponse> LoginAsync(LoginRequest req)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == req.Username);
        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            throw new UnauthorizedException("Sai tên đăng nhập hoặc mật khẩu.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var token = new JwtSecurityToken(
            claims: [new Claim(ClaimTypes.Name, user.Username)],
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new LoginResponse(new JwtSecurityTokenHandler().WriteToken(token));
    }
}
