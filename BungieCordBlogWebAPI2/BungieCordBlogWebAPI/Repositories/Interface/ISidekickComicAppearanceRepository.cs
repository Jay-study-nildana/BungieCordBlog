using BungieCordBlogWebAPI.Models.Domain;

public interface ISidekickComicAppearanceRepository
{
    Task<IEnumerable<SidekickComicAppearance>> GetAllAsync();
    Task<SidekickComicAppearance?> GetByIdsAsync(Guid sidekickId, Guid comicAppearanceId);
    Task<SidekickComicAppearance> AddAsync(SidekickComicAppearance entity);
    Task<SidekickComicAppearance?> UpdateAsync(Guid sidekickId, Guid comicAppearanceId, SidekickComicAppearance entity);
    Task<SidekickComicAppearance?> DeleteAsync(Guid sidekickId, Guid comicAppearanceId);
}