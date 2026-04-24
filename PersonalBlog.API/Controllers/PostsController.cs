using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalBlog.API.Common.Models;
using PersonalBlog.API.DTOs.Posts;
using PersonalBlog.API.Services.Interfaces;

namespace PersonalBlog.API.Controllers;

[ApiController]
[Route("api/posts")]
public class PostsController(IPostService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResponse<PostSummaryResponse>>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5,
        [FromQuery] string? tag = null)
    {
        var result = await service.GetAllAsync(page, pageSize, tag);
        return Ok(ApiResponse<PagedResponse<PostSummaryResponse>>.Ok(result));
    }

    [HttpGet("search")]
    public async Task<ActionResult<ApiResponse<List<PostSummaryResponse>>>> Search([FromQuery] string q)
    {
        var result = await service.SearchAsync(q);
        return Ok(ApiResponse<List<PostSummaryResponse>>.Ok(result));
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<ApiResponse<PostDetailResponse>>> GetBySlug(string slug)
    {
        var result = await service.GetBySlugAsync(slug);
        return Ok(ApiResponse<PostDetailResponse>.Ok(result));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<PostDetailResponse>>> Create(CreatePostRequest request)
    {
        var result = await service.CreateAsync(request);
        return CreatedAtAction(nameof(GetBySlug), new { slug = result.Slug },
            ApiResponse<PostDetailResponse>.Ok(result, "Tạo bài viết thành công."));
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Update(int id, UpdatePostRequest request)
    {
        await service.UpdateAsync(id, request);
        return Ok(ApiResponse.Ok("Cập nhật bài viết thành công."));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        await service.DeleteAsync(id);
        return Ok(ApiResponse.Ok("Xóa bài viết thành công."));
    }
}
