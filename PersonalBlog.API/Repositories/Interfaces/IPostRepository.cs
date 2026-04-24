using PersonalBlog.API.Models;

namespace PersonalBlog.API.Repositories.Interfaces;

public interface IPostRepository
{
    Task<(List<Post> Items, int Total)> GetAllAsync(int page, int pageSize, string? tag);
    Task<Post?> GetBySlugAsync(string slug);
    Task<Post?> GetByIdAsync(int id);
    Task<List<Post>> SearchAsync(string keyword);
    Task<Post> CreateAsync(Post post);
    Task UpdateAsync(Post post);
    Task DeleteAsync(Post post);
}
