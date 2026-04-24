using Microsoft.EntityFrameworkCore;
using PersonalBlog.API.Data;
using PersonalBlog.API.Models;
using PersonalBlog.API.Repositories.Interfaces;

namespace PersonalBlog.API.Repositories.Implementations;

public class PostRepository(AppDbContext db) : IPostRepository
{
    public async Task<(List<Post> Items, int Total)> GetAllAsync(int page, int pageSize, string? tag)
    {
        var query = db.Posts
            .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
            .AsQueryable();

        if (!string.IsNullOrEmpty(tag))
            query = query.Where(p => p.PostTags.Any(pt => pt.Tag.Slug == tag));

        var total = await query.CountAsync();
        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<Post?> GetBySlugAsync(string slug) =>
        await db.Posts
            .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
            .FirstOrDefaultAsync(p => p.Slug == slug);

    public async Task<Post?> GetByIdAsync(int id) =>
        await db.Posts
            .Include(p => p.PostTags)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<List<Post>> SearchAsync(string keyword) =>
        await db.Posts
            .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
            .Where(p => p.Title.Contains(keyword) || p.Content.Contains(keyword))
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

    public async Task<Post> CreateAsync(Post post)
    {
        db.Posts.Add(post);
        await db.SaveChangesAsync();
        return post;
    }

    public async Task UpdateAsync(Post post)
    {
        db.Posts.Update(post);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Post post)
    {
        db.Posts.Remove(post);
        await db.SaveChangesAsync();
    }
}
