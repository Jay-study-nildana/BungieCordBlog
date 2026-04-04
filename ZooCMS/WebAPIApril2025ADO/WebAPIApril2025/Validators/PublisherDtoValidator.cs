using FluentValidation;
using WebAPIApril2025.DTOs;

namespace WebAPIApril2025.Validators
{
    public class PublisherDtoValidator : AbstractValidator<PublisherDto>
    {
        public PublisherDtoValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Publisher name is required.")
                .MaximumLength(100).WithMessage("Publisher name cannot exceed 100 characters.");
        }
    }
}
