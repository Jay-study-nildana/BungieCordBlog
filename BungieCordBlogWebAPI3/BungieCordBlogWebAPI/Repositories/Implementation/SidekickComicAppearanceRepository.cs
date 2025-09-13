using BungieCordBlogWebAPI.Data;
using BungieCordBlogWebAPI.Models.Domain;
using Microsoft.EntityFrameworkCore;

public class SidekickComicAppearanceRepository : ISidekickComicAppearanceRepository
{
    private readonly ApplicationDbContext dbContext;

    public SidekickComicAppearanceRepository(ApplicationDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IEnumerable<SidekickComicAppearance>> GetAllAsync()
    {
        return await dbContext.SidekickComicAppearances.ToListAsync();
    }

    public async Task<SidekickComicAppearance?> GetByIdsAsync(Guid sidekickId, Guid comicAppearanceId)
    {
        return await dbContext.SidekickComicAppearances
            .FirstOrDefaultAsync(sca => sca.SidekickId == sidekickId && sca.ComicAppearanceId == comicAppearanceId);
    }

    public async Task<SidekickComicAppearance> AddAsync(SidekickComicAppearance entity)
    {
        dbContext.SidekickComicAppearances.Add(entity);
        await dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task<SidekickComicAppearance?> UpdateAsync(Guid sidekickId, Guid comicAppearanceId, SidekickComicAppearance entity)
    {
        var existing = await GetByIdsAsync(sidekickId, comicAppearanceId);
        if (existing == null) return null;

        // For a join table, you typically don't update the keys, but you could update additional properties if present.
        // If you want to allow changing the keys, you should delete and re-insert.

        await dbContext.SaveChangesAsync();
        return existing;
    }

    public async Task<SidekickComicAppearance?> DeleteAsync(Guid sidekickId, Guid comicAppearanceId)
    {
        var existing = await GetByIdsAsync(sidekickId, comicAppearanceId);
        if (existing == null) return null;

        dbContext.SidekickComicAppearances.Remove(existing);
        await dbContext.SaveChangesAsync();
        return existing;
    }
}