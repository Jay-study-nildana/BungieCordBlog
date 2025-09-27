namespace BungieCordBlogWebAPI.Models.Domain
{
    public class ProductUserInfo
    {
        public Guid Id { get; set; }

        // Foreign key to Product
        public Guid ProductId { get; set; }

        // Foreign key to User
        public Guid UserId { get; set; }

        // Email of the user who added the product
        public string Email { get; set; }

        // Date and time when the product was added
        public DateTime AddedDate { get; set; }

        // Optional: Is the product-user relationship active?
        public bool IsActive { get; set; }

        // Optional: Any notes or comments
        public string Notes { get; set; }
    }
}
