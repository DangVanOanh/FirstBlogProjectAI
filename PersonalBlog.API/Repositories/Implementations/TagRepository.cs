using Microsoft.EntityFrameworkCore;
using PersonalBlog.API.Data;
using PersonalBlog.API.Models;
using PersonalBlog.API.Repositories.Interfaces;

namespace PersonalBlog.API.Repositories.Implementations;

public class TagRepository(AppDbContext db) : ITagRepository
{
    public async Task<List<Tag>> GetAllAsync() =>
        await db.Tags.OrderBy(t => t.Name).ToListAsync();

    public async Task<Tag?> GetByIdAsync(int id) =>
        await db.Tags.FindAsync(id);

    public async Task<Tag> CreateAsync(Tag tag)
    {
        db.Tags.Add(tag);
        await db.SaveChangesAsync();
        return tag;
    }

    public async Task DeleteAsync(Tag tag)
    {
        db.Tags.Remove(tag);
        await db.SaveChangesAsync();
    }
}
