using BungieCordBlogWebAPI.Models.Domain;

namespace BungieCordBlogWebAPI.Repositories
{
    public interface IUserExtraInfoRepository
    {
        Task<User_Extra_Info?> GetByIdAsync(Guid id);
        Task<User_Extra_Info?> GetByEmailAsync(string email);
        Task<IEnumerable<User_Extra_Info>> GetAllAsync();
        Task<User_Extra_Info> AddAsync(User_Extra_Info user);
        Task<User_Extra_Info?> UpdateAsync(Guid id, User_Extra_Info user);
        Task<bool> DeleteAsync(Guid id);
    }
}