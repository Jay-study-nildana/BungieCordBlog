using BungieCordBlogWebAPI.Data;
using BungieCordBlogWebAPI.Models.Domain;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

public class SuperHeroRepository : ISuperHeroRepository
{
    private readonly ApplicationDbContext dbContext;
    private readonly IWebHostEnvironment webHostEnvironment;
    private readonly IHttpContextAccessor httpContextAccessor;

    public SuperHeroRepository(ApplicationDbContext dbContext,
            IWebHostEnvironment webHostEnvironment,
            IHttpContextAccessor httpContextAccessor)
    {
        this.dbContext = dbContext;
        this.webHostEnvironment = webHostEnvironment;
        this.httpContextAccessor = httpContextAccessor;
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

    public async Task<IEnumerable<SuperHeroImage>> GetImagesForSuperHeroAsync(Guid superHeroId)
    {
        // Assuming you have a DbSet<SuperHeroImage> in your DbContext
        return await dbContext.SuperHeroImages
            .Where(img => img.SuperHeroId == superHeroId)
            .ToListAsync();
    }

    public async Task<SuperHeroImage> AddImageToSuperHeroAsync(Guid superHeroId, SuperHeroImage image)
    {
        image.Id = Guid.NewGuid();
        image.SuperHeroId = superHeroId;
        dbContext.SuperHeroImages.Add(image);
        await dbContext.SaveChangesAsync();
        return image;
    }

    public async Task<SuperHeroImage> SaveSuperHeroImageAsync(Guid superHeroId, IFormFile file, string title)
    {
        var fileName = Guid.NewGuid().ToString();
        var fileExtension = Path.GetExtension(file.FileName);

        // Local path
        var localPath = Path.Combine(webHostEnvironment.ContentRootPath, "Images", $"{fileName}{fileExtension}");
        Directory.CreateDirectory(Path.GetDirectoryName(localPath)!);

        using (var stream = new FileStream(localPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // URL path
        var httpRequest = httpContextAccessor.HttpContext.Request;
        var urlPath = $"{httpRequest.Scheme}://{httpRequest.Host}{httpRequest.PathBase}/Images/{fileName}{fileExtension}";

        var image = new SuperHeroImage
        {
            Id = Guid.NewGuid(),
            FileName = fileName,
            FileExtension = fileExtension,
            Title = title,
            Url = urlPath,
            DateCreated = DateTime.UtcNow,
            SuperHeroId = superHeroId
        };

        dbContext.SuperHeroImages.Add(image);
        await dbContext.SaveChangesAsync();

        return image;
    }
}
