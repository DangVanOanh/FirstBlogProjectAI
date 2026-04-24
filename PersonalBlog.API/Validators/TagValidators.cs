using FluentValidation;
using PersonalBlog.API.DTOs.Tags;

namespace PersonalBlog.API.Validators;

public class CreateTagValidator : AbstractValidator<CreateTagRequest>
{
    public CreateTagValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tên tag không được để trống.")
            .MaximumLength(50).WithMessage("Tên tag tối đa 50 ký tự.")
            .Matches(@"^[\w\s\-]+$").WithMessage("Tên tag chỉ được chứa chữ, số, dấu cách và dấu gạch ngang.");
    }
}
