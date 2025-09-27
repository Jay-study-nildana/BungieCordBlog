using BungieCordBlogWebAPI.Models.Domain;

namespace BungieCordBlogWebAPI.Repositories.Interface
{
    public interface IProductUserInfoRepository
    {
        Task<ProductUserInfo?> GetByIdAsync(Guid id);
        Task<IEnumerable<ProductUserInfo>> GetAllAsync();
        Task<ProductUserInfo> AddAsync(ProductUserInfo info);
        Task<ProductUserInfo?> UpdateAsync(Guid id, ProductUserInfo info);
        Task<bool> DeleteAsync(Guid id);
        Task<IEnumerable<ProductUserInfo>> GetByUserIdAsync(Guid userId);
    }
}
