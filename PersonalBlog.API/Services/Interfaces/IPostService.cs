using PersonalBlog.API.DTOs.Posts;

namespace PersonalBlog.API.Services.Interfaces;

public interface IPostService
{
    Task<PagedResponse<PostSummaryResponse>> GetAllAsync(int page, int pageSize, string? tag);
    Task<PostDetailResponse> GetBySlugAsync(string slug);
    Task<List<PostSummaryResponse>> SearchAsync(string keyword);
    Task<PostDetailResponse> CreateAsync(CreatePostRequest request);
    Task UpdateAsync(int id, UpdatePostRequest request);
    Task DeleteAsync(int id);
}
