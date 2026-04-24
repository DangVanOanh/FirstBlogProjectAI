namespace PersonalBlog.API.DTOs.Comments;

public record CreateCommentRequest(string AuthorName, string Content);

public record CommentResponse(
    int Id,
    string AuthorName,
    string Content,
    DateTime CreatedAt
);
