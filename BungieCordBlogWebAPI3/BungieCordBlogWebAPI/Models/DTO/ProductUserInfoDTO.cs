namespace BungieCordBlogWebAPI.Models.DTO
{
    public class ProductUserInfoDTO
    {
    }

    public class CreateProductUserInfoDto
    {
        public Guid ProductId { get; set; }
        public Guid UserId { get; set; }
        public string Email { get; set; }
        public string Notes { get; set; }
    }

    public class UpdateProductUserInfoDto
    {
        public string Notes { get; set; }
        public bool IsActive { get; set; }
    }

    public class ProductUserInfoDto
    {
        public Guid Id { get; set; }
        public Guid ProductId { get; set; }
        public Guid UserId { get; set; }
        public string Email { get; set; }
        public DateTime AddedDate { get; set; }
        public bool IsActive { get; set; }
        public string Notes { get; set; }
    }
}
