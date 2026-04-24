namespace PersonalBlog.API.DTOs.Auth;

public record LoginRequest(string Username, string Password);
public record LoginResponse(string Token);
