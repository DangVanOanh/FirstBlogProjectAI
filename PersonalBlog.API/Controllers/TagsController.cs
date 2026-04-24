using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersonalBlog.API.Common.Models;
using PersonalBlog.API.DTOs.Tags;
using PersonalBlog.API.Services.Interfaces;

namespace PersonalBlog.API.Controllers;

[ApiController]
[Route("api/tags")]
public class TagsController(ITagService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<TagResponse>>>> GetAll()
    {
        var result = await service.GetAllAsync();
        return Ok(ApiResponse<List<TagResponse>>.Ok(result));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ApiResponse<TagResponse>>> Create(CreateTagRequest request)
    {
        var result = await service.CreateAsync(request);
        return Ok(ApiResponse<TagResponse>.Ok(result, "Tạo tag thành công."));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
    {
        await service.DeleteAsync(id);
        return Ok(ApiResponse.Ok("Xóa tag thành công."));
    }
}
