using BungieCordBlogWebAPI.Data;
using BungieCordBlogWebAPI.Models.Domain;
using Microsoft.EntityFrameworkCore;
using System;

namespace BungieCordBlogWebAPI.Repositories.Implementation
{
    public class UserExtraInfoRepository : IUserExtraInfoRepository
    {
        private readonly ApplicationDbContext dbContext;

        public UserExtraInfoRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<User_Extra_Info?> GetByIdAsync(Guid id)
        {
            return await dbContext.User_Extra_Infos.FindAsync(id);
        }

        public async Task<User_Extra_Info?> GetByEmailAsync(string email)
        {
            return await dbContext.User_Extra_Infos.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<IEnumerable<User_Extra_Info>> GetAllAsync()
        {
            return await dbContext.User_Extra_Infos.ToListAsync();
        }

        public async Task<User_Extra_Info> AddAsync(User_Extra_Info user)
        {
            dbContext.User_Extra_Infos.Add(user);
            await dbContext.SaveChangesAsync();
            return user;
        }

        public async Task<User_Extra_Info?> UpdateAsync(Guid id, User_Extra_Info user)
        {
            var existing = await dbContext.User_Extra_Infos.FindAsync(id);
            if (existing == null) return null;

            existing.Email = user.Email;
            existing.FullName = user.FullName;
            existing.PhoneNumber = user.PhoneNumber;
            existing.Role = user.Role;
            existing.Address = user.Address;
            existing.RegisteredDate = user.RegisteredDate;
            existing.IsActive = user.IsActive;
            existing.ProfileImageUrl = user.ProfileImageUrl;

            await dbContext.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var existing = await dbContext.User_Extra_Infos.FindAsync(id);
            if (existing == null) return false;

            dbContext.User_Extra_Infos.Remove(existing);
            await dbContext.SaveChangesAsync();
            return true;
        }
    }
}