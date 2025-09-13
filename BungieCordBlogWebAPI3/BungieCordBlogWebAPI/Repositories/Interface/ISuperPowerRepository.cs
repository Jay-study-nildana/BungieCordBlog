using BungieCordBlogWebAPI.Models.Domain;

public interface ISuperPowerRepository
{
    Task<IEnumerable<SuperPower>> GetAllAsync();
    Task<SuperPower?> GetByIdAsync(Guid id);
    Task<SuperPower> AddAsync(SuperPower superPower);
    Task<SuperPower?> UpdateAsync(Guid id, SuperPower superPower);
    Task<SuperPower?> DeleteAsync(Guid id);

    Task<IEnumerable<SuperPower>> GetBySuperHeroIdAsync(Guid superHeroId);
}