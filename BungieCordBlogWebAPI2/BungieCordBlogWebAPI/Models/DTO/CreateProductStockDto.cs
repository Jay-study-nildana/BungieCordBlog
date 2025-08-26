public class CreateProductStockDto
{
    public Guid SuperHeroId { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public string SKU { get; set; }
    public string Description { get; set; }
    public string Currency { get; set; }
    public bool IsActive { get; set; }
}