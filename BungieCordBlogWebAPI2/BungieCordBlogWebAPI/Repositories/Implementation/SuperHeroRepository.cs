using BungieCordBlogWebAPI.Data;
using BungieCordBlogWebAPI.Models.Domain;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

public class SuperHeroRepository : ISuperHeroRepository
{
    private readonly ApplicationDbContext dbContext;

    public SuperHeroRepository(ApplicationDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<IEnumerable<SuperHero>> GetAllAsync()
    {
        return await dbContext.SuperHeroes.ToListAsync();
    }

    public async Task<SuperHero?> GetByIdAsync(Guid id)
    {
        return await dbContext.SuperHeroes.FindAsync(id);
    }

    public async Task<SuperHero> AddAsync(SuperHero superHero)
    {
        superHero.Id = Guid.NewGuid();
        dbContext.SuperHeroes.Add(superHero);
        await dbContext.SaveChangesAsync();
        return superHero;
    }

    public async Task<SuperHero?> UpdateAsync(Guid id, SuperHero superHero)
    {
        var existing = await dbContext.SuperHeroes.FindAsync(id);
        if (existing == null) return null;

        existing.Name = superHero.Name;
        existing.Alias = superHero.Alias;
        existing.Age = superHero.Age;
        existing.Origin = superHero.Origin;
        existing.FirstAppearance = superHero.FirstAppearance;
        existing.IsActive = superHero.IsActive;

        await dbContext.SaveChangesAsync();
        return existing;
    }

    public async Task<SuperHero?> DeleteAsync(Guid id)
    {
        var existing = await dbContext.SuperHeroes.FindAsync(id);
        if (existing == null) return null;

        dbContext.SuperHeroes.Remove(existing);
        await dbContext.SaveChangesAsync();
        return existing;
    }
}
