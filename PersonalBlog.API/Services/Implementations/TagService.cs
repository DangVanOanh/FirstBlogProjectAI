using PersonalBlog.API.Common.Exceptions;
using PersonalBlog.API.DTOs.Tags;
using PersonalBlog.API.Helpers;
using PersonalBlog.API.Models;
using PersonalBlog.API.Repositories.Interfaces;
using PersonalBlog.API.Services.Interfaces;

namespace PersonalBlog.API.Services.Implementations;

public class TagService(ITagRepository repo) : ITagService
{
    public async Task<List<TagResponse>> GetAllAsync() =>
        (await repo.GetAllAsync()).Select(t => new TagResponse(t.Id, t.Name, t.Slug)).ToList();

    public async Task<TagResponse> CreateAsync(CreateTagRequest req)
    {
        var tag = new Tag { Name = req.Name, Slug = SlugHelper.Generate(req.Name) };
        await repo.CreateAsync(tag);
        return new TagResponse(tag.Id, tag.Name, tag.Slug);
    }

    public async Task DeleteAsync(int id)
    {
        var tag = await repo.GetByIdAsync(id)
            ?? throw new NotFoundException("Tag", id);
        await repo.DeleteAsync(tag);
    }
}
