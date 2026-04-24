namespace PersonalBlog.API.DTOs.Posts;

public record PostSummaryResponse(
    int Id,
    string Title,
    string Slug,
    string? Thumbnail,
    List<string> Tags,
    DateTime CreatedAt
);

public record PostDetailResponse(
    int Id,
    string Title,
    string Slug,
    string Content,
    string? Thumbnail,
    List<string> Tags,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record PagedResponse<T>(
    List<T> Data,
    int TotalCount,
    int Page,
    int PageSize
);
