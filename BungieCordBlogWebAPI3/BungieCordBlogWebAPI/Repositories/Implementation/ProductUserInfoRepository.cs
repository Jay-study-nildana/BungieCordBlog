using BungieCordBlogWebAPI.Data;
using BungieCordBlogWebAPI.Models.Domain;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BungieCordBlogWebAPI.Repositories.Implementation
{
    public class ProductUserInfoRepository : IProductUserInfoRepository
    {
        private readonly ApplicationDbContext dbContext;

        public ProductUserInfoRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<ProductUserInfo?> GetByIdAsync(Guid id)
            => await dbContext.Set<ProductUserInfo>().FindAsync(id);

        public async Task<IEnumerable<ProductUserInfo>> GetAllAsync()
            => await dbContext.Set<ProductUserInfo>().ToListAsync();

        public async Task<ProductUserInfo> AddAsync(ProductUserInfo info)
        {
            info.Id = Guid.NewGuid();
            info.AddedDate = DateTime.UtcNow;
            dbContext.Set<ProductUserInfo>().Add(info);
            await dbContext.SaveChangesAsync();
            return info;
        }

        public async Task<ProductUserInfo?> UpdateAsync(Guid id, ProductUserInfo info)
        {
            var existing = await dbContext.Set<ProductUserInfo>().FindAsync(id);
            if (existing == null) return null;

            existing.Notes = info.Notes;
            existing.IsActive = info.IsActive;
            // Optionally update other fields if needed
            await dbContext.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await dbContext.Set<ProductUserInfo>().FindAsync(id);
            if (existing == null) return false;

            dbContext.Set<ProductUserInfo>().Remove(existing);
            await dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ProductUserInfo>> GetByUserIdAsync(Guid userId)
        {
            return await dbContext.Set<ProductUserInfo>()
                .Where(p => p.UserId == userId)
                .ToListAsync();
        }
    }
}
