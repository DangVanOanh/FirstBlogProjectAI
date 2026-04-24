using Microsoft.EntityFrameworkCore;
using PersonalBlog.API.Data.Configurations;
using PersonalBlog.API.Models;

namespace PersonalBlog.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<PostTag> PostTags => Set<PostTag>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.ApplyConfiguration(new PostConfiguration());
        mb.ApplyConfiguration(new TagConfiguration());
        mb.ApplyConfiguration(new CommentConfiguration());

        mb.Entity<PostTag>().HasKey(pt => new { pt.PostId, pt.TagId });
        mb.Entity<User>().HasIndex(u => u.Username).IsUnique();
    }
}
