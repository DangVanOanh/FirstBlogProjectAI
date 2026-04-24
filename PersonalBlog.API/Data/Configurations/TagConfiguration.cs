using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PersonalBlog.API.Models;

namespace PersonalBlog.API.Data.Configurations;

public class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Name).IsRequired().HasMaxLength(50);
        builder.Property(t => t.Slug).IsRequired().HasMaxLength(50);
        builder.HasIndex(t => t.Slug).IsUnique();
        builder.HasIndex(t => t.Name).IsUnique();
    }
}
