using BungieCordBlogWebAPI.Models.Domain;

namespace BungieCordBlogWebAPI.Repositories.Interface
{
    public interface ISuperHeroRepository
    {
        Task<IEnumerable<SuperHero>> GetAllAsync();
        Task<SuperHero?> GetByIdAsync(Guid id);
        Task<SuperHero> AddAsync(SuperHero superHero);
        Task<SuperHero?> UpdateAsync(Guid id, SuperHero superHero);
        Task<SuperHero?> DeleteAsync(Guid id);
    }
}
