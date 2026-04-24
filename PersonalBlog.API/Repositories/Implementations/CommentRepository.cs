using Microsoft.EntityFrameworkCore;
using PersonalBlog.API.Data;
using PersonalBlog.API.Models;
using PersonalBlog.API.Repositories.Interfaces;

namespace PersonalBlog.API.Repositories.Implementations;

public class CommentRepository(AppDbContext db) : ICommentRepository
{
    public async Task<List<Comment>> GetByPostIdAsync(int postId) =>
        await db.Comments
            .Where(c => c.PostId == postId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

    public async Task<Comment> CreateAsync(Comment comment)
    {
        db.Comments.Add(comment);
        await db.SaveChangesAsync();
        return comment;
    }
}
