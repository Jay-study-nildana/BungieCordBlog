using Microsoft.EntityFrameworkCore;
using WebAPIApril2025.Data;

namespace WebAPIApril2025.Helpers
{
    public class Helper
    {
        private readonly ApplicationDbContext _context;

        public Helper(ApplicationDbContext context)
        {
            _context = context;
        }

        // Check if a publisher exists based on the title
        public async Task<bool> PublisherExistsAsync(string publisherName)
        {
            return await _context.Publishers.AnyAsync(p => p.Name == publisherName);
        }

        // Check if a comic book exists based on the title
        public async Task<bool> ComicExistsAsync(string comicTitle)
        {
            return await _context.Comics.AnyAsync(c => c.Title == comicTitle);
        }

        // Check if a character exists in a given comic book
        public async Task<bool> CharacterExistsAsync(string characterName, int comicId)
        {
            return await _context.Characters.AnyAsync(c => c.Name == characterName && c.ComicId == comicId);
        }
    }
}
