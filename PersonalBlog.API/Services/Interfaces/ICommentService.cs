using PersonalBlog.API.DTOs.Comments;

namespace PersonalBlog.API.Services.Interfaces;

public interface ICommentService
{
    Task<List<CommentResponse>> GetByPostIdAsync(int postId);
    Task<CommentResponse> CreateAsync(int postId, CreateCommentRequest request);
}
