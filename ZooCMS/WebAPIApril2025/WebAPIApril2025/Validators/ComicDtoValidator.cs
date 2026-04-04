using FluentValidation;
using WebAPIApril2025.DTOs;

namespace WebAPIApril2025.Validators
{
    public class ComicDtoValidator : AbstractValidator<ComicDto>
    {
        public ComicDtoValidator()
        {
            RuleFor(c => c.Title)
                .NotEmpty().WithMessage("Comic title is required.")
                .MaximumLength(100).WithMessage("Comic title cannot exceed 100 characters.");

            RuleFor(c => c.PublisherId)
                .GreaterThan(0).WithMessage("PublisherId must be greater than 0.");
        }
    }
}
