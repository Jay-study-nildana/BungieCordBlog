using BungieCordBlogWebAPI.Models.Domain;

public interface IProductStockRepository
{
    Task<ProductStock?> GetByIdAsync(Guid id);
    Task<IEnumerable<ProductStock>> GetAllAsync();
    Task<ProductStock> AddAsync(ProductStock productStock);
    Task<ProductStock?> UpdateAsync(Guid id, ProductStock productStock);
    Task<bool> DeleteAsync(Guid id);

    // Increases the stock quantity of an existing product.
    Task<ProductStock?> IncreaseStockAsync(Guid productId, int amount);

    // Decreases the stock quantity of an existing product.
    Task<ProductStock?> DecreaseStockAsync(Guid productId, int amount);

    // Disables a product (sets IsActive to false).
    Task<ProductStock?> DisableProductAsync(Guid productId);

    // Enables a product (sets IsActive to true).
    Task<ProductStock?> EnableProductAsync(Guid productId);
}