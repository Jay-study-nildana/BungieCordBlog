using BungieCordBlogWebAPI.Data;
using BungieCordBlogWebAPI.Models.Domain;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

public class ProductStockRepository : IProductStockRepository
{
    private readonly ApplicationDbContext dbContext;

    public ProductStockRepository(ApplicationDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<ProductStock?> GetByIdAsync(Guid id)
        => await dbContext.Set<ProductStock>().FindAsync(id);

    public async Task<IEnumerable<ProductStock>> GetAllAsync()
        => await dbContext.Set<ProductStock>().ToListAsync();

    public async Task<ProductStock> AddAsync(ProductStock productStock)
    {
        productStock.Id = Guid.NewGuid();
        productStock.LastUpdated = DateTime.UtcNow;
        dbContext.Set<ProductStock>().Add(productStock);
        await dbContext.SaveChangesAsync();
        return productStock;
    }

    public async Task<ProductStock?> UpdateAsync(Guid id, ProductStock productStock)
    {
        var existing = await dbContext.Set<ProductStock>().FindAsync(id);
        if (existing == null) return null;

        existing.UnitPrice = productStock.UnitPrice;
        existing.Quantity = productStock.Quantity;
        existing.SKU = productStock.SKU;
        existing.Description = productStock.Description;
        existing.Currency = productStock.Currency;
        existing.IsActive = productStock.IsActive;
        existing.LastUpdated = DateTime.UtcNow;

        await dbContext.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existing = await dbContext.Set<ProductStock>().FindAsync(id);
        if (existing == null) return false;

        dbContext.Set<ProductStock>().Remove(existing);
        await dbContext.SaveChangesAsync();
        return true;
    }
}