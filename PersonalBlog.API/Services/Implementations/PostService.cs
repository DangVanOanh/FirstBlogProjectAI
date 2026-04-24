using PersonalBlog.API.Common.Exceptions;
using PersonalBlog.API.DTOs.Posts;
using PersonalBlog.API.Helpers;
using PersonalBlog.API.Models;
using PersonalBlog.API.Repositories.Interfaces;
using PersonalBlog.API.Services.Interfaces;

namespace PersonalBlog.API.Services.Implementations;

public class PostService(IPostRepository repo) : IPostService
{
    public async Task<PagedResponse<PostSummaryResponse>> GetAllAsync(int page, int pageSize, string? tag)
    {
        var (items, total) = await repo.GetAllAsync(page, pageSize, tag);
        return new PagedResponse<PostSummaryResponse>(
            items.Select(ToSummary).ToList(), total, page, pageSize);
    }

    public async Task<PostDetailResponse> GetBySlugAsync(string slug)
    {
        var post = await repo.GetBySlugAsync(slug)
            ?? throw new NotFoundException("Bài viết", slug);
        return ToDetail(post);
    }

    public async Task<List<PostSummaryResponse>> SearchAsync(string keyword) =>
        (await repo.SearchAsync(keyword)).Select(ToSummary).ToList();

    public async Task<PostDetailResponse> CreateAsync(CreatePostRequest req)
    {
        var post = new Post
        {
            Title = req.Title,
            Content = req.Content,
            Thumbnail = req.Thumbnail,
            Slug = SlugHelper.Generate(req.Title),
            PostTags = req.TagIds.Select(id => new PostTag { TagId = id }).ToList()
        };
        await repo.CreateAsync(post);
        var created = await repo.GetBySlugAsync(post.Slug);
        return ToDetail(created!);
    }

    public async Task UpdateAsync(int id, UpdatePostRequest req)
    {
        var post = await repo.GetByIdAsync(id)
            ?? throw new NotFoundException("Bài viết", id);

        post.Title = req.Title;
        post.Content = req.Content;
        post.Thumbnail = req.Thumbnail;
        post.Slug = SlugHelper.Generate(req.Title);
        post.UpdatedAt = DateTime.UtcNow;
        post.PostTags = req.TagIds.Select(tid => new PostTag { PostId = id, TagId = tid }).ToList();

        await repo.UpdateAsync(post);
    }

    public async Task DeleteAsync(int id)
    {
        var post = await repo.GetByIdAsync(id)
            ?? throw new NotFoundException("Bài viết", id);
        await repo.DeleteAsync(post);
    }

    private static PostSummaryResponse ToSummary(Post p) => new(
        p.Id, p.Title, p.Slug, p.Thumbnail,
        p.PostTags.Select(pt => pt.Tag.Name).ToList(), p.CreatedAt);

    private static PostDetailResponse ToDetail(Post p) => new(
        p.Id, p.Title, p.Slug, p.Content, p.Thumbnail,
        p.PostTags.Select(pt => pt.Tag.Name).ToList(), p.CreatedAt, p.UpdatedAt);
}
