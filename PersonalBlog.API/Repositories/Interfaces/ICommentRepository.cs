using PersonalBlog.API.Models;

namespace PersonalBlog.API.Repositories.Interfaces;

public interface ICommentRepository
{
    Task<List<Comment>> GetByPostIdAsync(int postId);
    Task<Comment> CreateAsync(Comment comment);
}
