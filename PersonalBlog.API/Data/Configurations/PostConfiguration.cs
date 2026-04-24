using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalBlog.API.Models;

namespace PersonalBlog.API.Data.Configurations;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Title).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Content).IsRequired();
        builder.Property(p => p.Slug).IsRequired().HasMaxLength(200);
        builder.Property(p => p.Thumbnail).HasMaxLength(500);
        builder.HasIndex(p => p.Slug).IsUnique();

        builder.HasMany(p => p.Comments)
               .WithOne(c => c.Post)
               .HasForeignKey(c => c.PostId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
