namespace PersonalBlog.API.DTOs.Posts;

public record CreatePostRequest(
    string Title,
    string Content,
    string? Thumbnail,
    List<int> TagIds
);

public record UpdatePostRequest(
    string Title,
    string Content,
    string? Thumbnail,
    List<int> TagIds
);
