using BungieCordBlogWebAPI.Data;
using BungieCordBlogWebAPI.Models.Domain;
using Microsoft.EntityFrameworkCore;

public class SuperPowerRepository : ISuperPowerRepository
{
    private readonly ApplicationDbContext dbContext;

    public SuperPowerRepository(ApplicationDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IEnumerable<SuperPower>> GetAllAsync()
    {
        return await dbContext.SuperPowers.ToListAsync();
    }

    public async Task<SuperPower?> GetByIdAsync(Guid id)
    {
        return await dbContext.SuperPowers.FindAsync(id);
    }

    public async Task<SuperPower> AddAsync(SuperPower superPower)
    {
        superPower.Id = Guid.NewGuid();
        dbContext.SuperPowers.Add(superPower);
        await dbContext.SaveChangesAsync();
        return superPower;
    }

    public async Task<SuperPower?> UpdateAsync(Guid id, SuperPower superPower)
    {
        var existing = await dbContext.SuperPowers.FindAsync(id);
        if (existing == null) return null;

        existing.PowerName = superPower.PowerName;
        existing.Description = superPower.Description;
        existing.SuperHeroId = superPower.SuperHeroId;

        await dbContext.SaveChangesAsync();
        return existing;
    }

    public async Task<SuperPower?> DeleteAsync(Guid id)
    {
        var existing = await dbContext.SuperPowers.FindAsync(id);
        if (existing == null) return null;

        dbContext.SuperPowers.Remove(existing);
        await dbContext.SaveChangesAsync();
        return existing;
    }

    public async Task<IEnumerable<SuperPower>> GetBySuperHeroIdAsync(Guid superHeroId)
    {
        return await dbContext.SuperPowers
            .Where(sp => sp.SuperHeroId == superHeroId)
            .ToListAsync();
    }
}