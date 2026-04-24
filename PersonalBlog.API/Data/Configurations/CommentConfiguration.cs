using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalBlog.API.Models;

namespace PersonalBlog.API.Data.Configurations;

public class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.HasKey(c => c.Id);
        builder.Property(c => c.AuthorName).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Content).IsRequired().HasMaxLength(1000);
    }
}
