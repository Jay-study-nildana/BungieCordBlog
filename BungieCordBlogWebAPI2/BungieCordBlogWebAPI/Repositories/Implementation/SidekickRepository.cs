using BungieCordBlogWebAPI.Data;
using BungieCordBlogWebAPI.Models.Domain;
using Microsoft.EntityFrameworkCore;

public class SidekickRepository : ISidekickRepository
{
    private readonly ApplicationDbContext dbContext;

    public SidekickRepository(ApplicationDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IEnumerable<Sidekick>> GetAllAsync()
    {
        return await dbContext.Sidekicks.ToListAsync();
    }

    public async Task<Sidekick?> GetByIdAsync(Guid id)
    {
        return await dbContext.Sidekicks.FindAsync(id);
    }

    public async Task<Sidekick> AddAsync(Sidekick sidekick)
    {
        sidekick.Id = Guid.NewGuid();
        dbContext.Sidekicks.Add(sidekick);
        await dbContext.SaveChangesAsync();
        return sidekick;
    }

    public async Task<Sidekick?> UpdateAsync(Guid id, Sidekick sidekick)
    {
        var existing = await dbContext.Sidekicks.FindAsync(id);
        if (existing == null) return null;

        existing.Name = sidekick.Name;
        existing.Age = sidekick.Age;
        existing.SuperHeroId = sidekick.SuperHeroId;

        await dbContext.SaveChangesAsync();
        return existing;
    }

    public async Task<Sidekick?> DeleteAsync(Guid id)
    {
        var existing = await dbContext.Sidekicks.FindAsync(id);
        if (existing == null) return null;

        dbContext.Sidekicks.Remove(existing);
        await dbContext.SaveChangesAsync();
        return existing;
    }
}