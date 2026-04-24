using PersonalBlog.API.Models;

namespace PersonalBlog.API.Repositories.Interfaces;

public interface ITagRepository
{
    Task<List<Tag>> GetAllAsync();
    Task<Tag?> GetByIdAsync(int id);
    Task<Tag> CreateAsync(Tag tag);
    Task DeleteAsync(Tag tag);
}
