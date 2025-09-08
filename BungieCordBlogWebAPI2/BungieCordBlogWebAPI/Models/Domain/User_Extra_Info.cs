namespace BungieCordBlogWebAPI.Models.Domain
{
    public class User_Extra_Info
    {
        // Primary key
        public Guid Id { get; set; }

        // Email address (unique)
        public string Email { get; set; }

        // Display name or full name
        public string FullName { get; set; }

        // Phone number
        public string PhoneNumber { get; set; }

        // Role (e.g., Admin, Customer, Vendor, ShopOwner)
        public string Role { get; set; }

        // Address (can be expanded to a separate Address entity if needed)
        public string Address { get; set; }

        // Date of registration
        public DateTime RegisteredDate { get; set; }

        // Is the user active?
        public bool IsActive { get; set; }

        // Optional: profile image URL
        public string ProfileImageUrl { get; set; }
    }
}
