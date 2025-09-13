using BungieCordBlogWebAPI.Models.Domain;

public interface ISidekickRepository
{
    Task<IEnumerable<Sidekick>> GetAllAsync();
    Task<Sidekick?> GetByIdAsync(Guid id);
    Task<Sidekick> AddAsync(Sidekick sidekick);
    Task<Sidekick?> UpdateAsync(Guid id, Sidekick sidekick);
    Task<Sidekick?> DeleteAsync(Guid id);

    Task<IEnumerable<Sidekick>> GetBySuperHeroIdAsync(Guid superHeroId);

}