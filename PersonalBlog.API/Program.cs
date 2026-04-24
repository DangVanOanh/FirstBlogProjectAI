using PersonalBlog.API.Common.Extensions;
using PersonalBlog.API.Data;
using PersonalBlog.API.Middleware;
using PersonalBlog.API.Models;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((ctx, services, config) => config
        .ReadFrom.Configuration(ctx.Configuration)
        .ReadFrom.Services(services)
        .WriteTo.Console()
        .WriteTo.File("logs/app-.log", rollingInterval: RollingInterval.Day));

    builder.Services
        .AddDatabase(builder.Configuration)
        .AddRepositories()
        .AddServices()
        .AddJwtAuthentication(builder.Configuration)
        .AddValidation()
        .AddCorsPolicy(builder.Configuration)
        .AddControllers()
        .ConfigureApiBehaviorOptions(o =>
        {
            // Tắt default validation response, dùng FluentValidation + middleware thay thế
            o.SuppressModelStateInvalidFilter = true;
        });

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    var app = builder.Build();

    // Seed data lần đầu
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureCreated();
        if (!db.Users.Any())
        {
            db.Users.Add(new User
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123")
            });
            db.SaveChanges();
        }
    }

    app.UseMiddleware<ErrorHandlingMiddleware>();
    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseCors();
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    Log.Information("Personal Blog API started.");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application failed to start.");
}
finally
{
    Log.CloseAndFlush();
}
