using FluentValidation;
using PersonalBlog.API.DTOs.Comments;

namespace PersonalBlog.API.Validators;

public class CreateCommentValidator : AbstractValidator<CreateCommentRequest>
{
    public CreateCommentValidator()
    {
        RuleFor(x => x.AuthorName)
            .NotEmpty().WithMessage("Tên tác giả không được để trống.")
            .MaximumLength(100).WithMessage("Tên tối đa 100 ký tự.");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Nội dung bình luận không được để trống.")
            .MaximumLength(1000).WithMessage("Bình luận tối đa 1000 ký tự.");
    }
}
