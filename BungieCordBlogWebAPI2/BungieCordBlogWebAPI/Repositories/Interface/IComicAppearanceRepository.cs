using BungieCordBlogWebAPI.Models.Domain;

public interface IComicAppearanceRepository
{
    Task<IEnumerable<ComicAppearance>> GetAllAsync();
    Task<ComicAppearance?> GetByIdAsync(Guid id);
    Task<ComicAppearance> AddAsync(ComicAppearance comicAppearance);
    Task<ComicAppearance?> UpdateAsync(Guid id, ComicAppearance comicAppearance);
    Task<ComicAppearance?> DeleteAsync(Guid id);
}