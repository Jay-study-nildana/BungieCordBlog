using BungieCordBlogWebAPI.Data;
using BungieCordBlogWebAPI.Models.Domain;
using Microsoft.EntityFrameworkCore;

public class ComicAppearanceRepository : IComicAppearanceRepository
{
    private readonly ApplicationDbContext dbContext;

    public ComicAppearanceRepository(ApplicationDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IEnumerable<ComicAppearance>> GetAllAsync()
    {
        return await dbContext.ComicAppearances.ToListAsync();
    }

    public async Task<ComicAppearance?> GetByIdAsync(Guid id)
    {
        return await dbContext.ComicAppearances.FindAsync(id);
    }

    public async Task<ComicAppearance> AddAsync(ComicAppearance comicAppearance)
    {
        comicAppearance.Id = Guid.NewGuid();
        dbContext.ComicAppearances.Add(comicAppearance);
        await dbContext.SaveChangesAsync();
        return comicAppearance;
    }

    public async Task<ComicAppearance?> UpdateAsync(Guid id, ComicAppearance comicAppearance)
    {
        var existing = await dbContext.ComicAppearances.FindAsync(id);
        if (existing == null) return null;

        existing.ComicTitle = comicAppearance.ComicTitle;
        existing.IssueNumber = comicAppearance.IssueNumber;
        existing.ReleaseDate = comicAppearance.ReleaseDate;
        existing.SuperHeroId = comicAppearance.SuperHeroId;

        await dbContext.SaveChangesAsync();
        return existing;
    }

    public async Task<ComicAppearance?> DeleteAsync(Guid id)
    {
        var existing = await dbContext.ComicAppearances.FindAsync(id);
        if (existing == null) return null;

        dbContext.ComicAppearances.Remove(existing);
        await dbContext.SaveChangesAsync();
        return existing;
    }
}