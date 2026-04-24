using Microsoft.AspNetCore.Mvc;
using PersonalBlog.API.Common.Models;
using PersonalBlog.API.DTOs.Comments;
using PersonalBlog.API.Services.Interfaces;

namespace PersonalBlog.API.Controllers;

[ApiController]
[Route("api/posts/{postId}/comments")]
public class CommentsController(ICommentService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<CommentResponse>>>> GetAll(int postId)
    {
        var result = await service.GetByPostIdAsync(postId);
        return Ok(ApiResponse<List<CommentResponse>>.Ok(result));
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<CommentResponse>>> Create(int postId, CreateCommentRequest request)
    {
        var result = await service.CreateAsync(postId, request);
        return Ok(ApiResponse<CommentResponse>.Ok(result, "Gửi bình luận thành công."));
    }
}
