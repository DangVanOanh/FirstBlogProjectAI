using PersonalBlog.API.DTOs.Comments;
using PersonalBlog.API.Models;
using PersonalBlog.API.Repositories.Interfaces;
using PersonalBlog.API.Services.Interfaces;

namespace PersonalBlog.API.Services.Implementations;

public class CommentService(ICommentRepository repo) : ICommentService
{
    public async Task<List<CommentResponse>> GetByPostIdAsync(int postId) =>
        (await repo.GetByPostIdAsync(postId))
            .Select(c => new CommentResponse(c.Id, c.AuthorName, c.Content, c.CreatedAt))
            .ToList();

    public async Task<CommentResponse> CreateAsync(int postId, CreateCommentRequest req)
    {
        var comment = new Comment
        {
            PostId = postId,
            AuthorName = req.AuthorName,
            Content = req.Content
        };
        await repo.CreateAsync(comment);
        return new CommentResponse(comment.Id, comment.AuthorName, comment.Content, comment.CreatedAt);
    }
}
