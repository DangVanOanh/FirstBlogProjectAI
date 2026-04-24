namespace PersonalBlog.API.DTOs.Tags;

public record CreateTagRequest(string Name);
public record TagResponse(int Id, string Name, string Slug);
