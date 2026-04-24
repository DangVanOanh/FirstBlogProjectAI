using PersonalBlog.API.DTOs.Tags;

namespace PersonalBlog.API.Services.Interfaces;

public interface ITagService
{
    Task<List<TagResponse>> GetAllAsync();
    Task<TagResponse> CreateAsync(CreateTagRequest request);
    Task DeleteAsync(int id);
}
