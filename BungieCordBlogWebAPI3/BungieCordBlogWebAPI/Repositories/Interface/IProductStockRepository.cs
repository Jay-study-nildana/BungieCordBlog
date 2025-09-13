using BungieCordBlogWebAPI.Models.Domain;

public interface IProductStockRepository
{
    Task<ProductStock?> GetByIdAsync(Guid id);
    Task<IEnumerable<ProductStock>> GetAllAsync();
    Task<ProductStock> AddAsync(ProductStock productStock);
    Task<ProductStock?> UpdateAsync(Guid id, ProductStock productStock);
    Task<bool> DeleteAsync(Guid id);
}