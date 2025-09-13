using System;

namespace BungieCordBlogWebAPI.Models.Domain
{
    // Represents stock information for a product related to a SuperHero.
    public class ProductStock
    {
        // Primary key for the product stock record.
        public Guid Id { get; set; }

        // Foreign key to the SuperHero this product is associated with.
        public Guid SuperHeroId { get; set; }

        // Navigation property to the SuperHero entity.
        public SuperHero SuperHero { get; set; }

        // Price per unit of the product.
        public decimal UnitPrice { get; set; }

        // Quantity available in stock.
        public int Quantity { get; set; }

        // Optional: Stock Keeping Unit for inventory management.
        public string SKU { get; set; }

        // Optional: Description of the product.
        public string Description { get; set; }

        // Optional: Currency code (e.g., "USD", "EUR").
        public string Currency { get; set; }

        // Optional: Is this product active/available for sale?
        public bool IsActive { get; set; }

        // Optional: When was this stock last updated?
        public DateTime LastUpdated { get; set; }
    }
}