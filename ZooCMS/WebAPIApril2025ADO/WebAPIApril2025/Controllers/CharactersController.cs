using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using WebAPIApril2025.Data;
using WebAPIApril2025.DTOs;
using WebAPIApril2025.Helpers;
using WebAPIApril2025.Models;
using WebAPIApril2025.Services;

namespace WebAPIApril2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CharactersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly Helper _helper;
        private readonly IQuoteService _quoteService;
        private readonly IMemoryCache _cache;

        public CharactersController(ApplicationDbContext context, Helper helper, IQuoteService quoteService, IMemoryCache cache)
        {
            _context = context;
            _helper = helper;
            _quoteService = quoteService;
            _cache = cache;
        }

        [HttpGet]
        [Route("GetRandomQuote")]
        public ActionResult<string> GetRandomQuote()
        {
            var quote = _quoteService.GetRandomQuote();
            return Ok(quote);
        }

        [HttpGet]
        [Route("GetCharacters")]
        public async Task<ActionResult<IEnumerable<CharacterDto>>> GetCharacters()
        {
            var response =  await _context.Characters
                .Include(c => c.Comic)
                .Select(c => new CharacterDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    ComicTitle = c.Comic.Title,
                    ComicId = c.Comic.Id,
                })
                .ToListAsync();
            return response;
        }

        [HttpGet]
        [Route("GetCharactersWithCache")]
        public async Task<ActionResult<IEnumerable<CharacterDto>>> GetCharactersWithCache()
        {
            const string cacheKey = "GetCharactersCache";

            // Try to get data from cache
            if (!_cache.TryGetValue(cacheKey, out List<CharacterDto> cachedCharacters))
            {
                // If not in cache, fetch from database
                cachedCharacters = await _context.Characters
                    .Include(c => c.Comic)
                    .Select(c => new CharacterDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        ComicTitle = c.Comic.Title,
                        ComicId = c.Comic.Id,
                    })
                    .ToListAsync();

                // Set cache options
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10), // Cache for 10 minutes
                    SlidingExpiration = TimeSpan.FromMinutes(5) // Reset expiration if accessed
                };

                // Save data in cache
                _cache.Set(cacheKey, cachedCharacters, cacheOptions);
            }

            return Ok(cachedCharacters);
        }

        [HttpPost]
        [Route("CreateCharacterWithCache")]
        public async Task<ActionResult<CharacterDto>> CreateCharacterWithCache(CharacterDto characterDto)
        {
            // Validation is automatically applied here via Fluent Validation
            if (await _helper.CharacterExistsAsync(characterDto.Name, characterDto.ComicId))
            {
                return BadRequest($"Character with name '{characterDto.Name}' already exists in the specified comic.");
            }

            var comic = await _context.Comics.FirstOrDefaultAsync(c => c.Id == characterDto.ComicId);
            if (comic == null) throw new Exception("Comic not found."); // With error handling middleware

            var character = new Character
            {
                Name = characterDto.Name,
                ComicId = comic.Id,
                Comic = comic
            };

            _context.Characters.Add(character);
            await _context.SaveChangesAsync();

            // Invalidate the cache for GetCharactersWithCache
            const string cacheKey = "GetCharactersCache";
            _cache.Remove(cacheKey);

            characterDto.Id = character.Id;
            characterDto.ComicTitle = comic.Title; // Populate ComicTitle for the response
            return CreatedAtAction(nameof(GetCharacters), new { id = character.Id }, characterDto);
        }


        [HttpPost]
        [Route("CreateCharacter")]
        public async Task<ActionResult<CharacterDto>> CreateCharacter(CharacterDto characterDto)
        {
            // Validation is automatically applied here via Fluent Validation
            if (await _helper.CharacterExistsAsync(characterDto.Name, characterDto.ComicId))
            {
                return BadRequest($"Character with name '{characterDto.Name}' already exists in the specified comic.");
            }
            var comic = await _context.Comics.FirstOrDefaultAsync(c => c.Id == characterDto.ComicId);
            //if (comic == null) return BadRequest("Comic not found."); 
            //without error handling middleware
            if (comic == null) throw new Exception("Comic not found."); //with error handling middleware

            var character = new Character
            {
                Name = characterDto.Name,
                ComicId = comic.Id,
                Comic = comic
            };

            _context.Characters.Add(character);
            await _context.SaveChangesAsync();

            characterDto.Id = character.Id;
            characterDto.ComicTitle = comic.Title; // Populate ComicTitle for the response
            return CreatedAtAction(nameof(GetCharacters), new { id = character.Id }, characterDto);
        }

        [HttpGet]
        [Route("GetComics")]
        public async Task<ActionResult<IEnumerable<ComicDto>>> GetComics()
        {
            return await _context.Comics
                .Select(c => new ComicDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    PublisherId = c.PublisherId
                })
                .ToListAsync();
        }

        [HttpPost]
        [Route("CreateComic")]
        public async Task<ActionResult<ComicDto>> CreateComic(ComicDto comicDto)
        {
            if (await _helper.ComicExistsAsync(comicDto.Title))
            {
                return BadRequest($"Comic with title '{comicDto.Title}' already exists.");
            }
            var publisher = await _context.Publishers.FirstOrDefaultAsync(p => p.Id == comicDto.PublisherId);
            //if (publisher == null) return BadRequest("Publisher not found.");
            //without error handling middleware
            if (publisher == null) throw new Exception("publisher not found."); //with error handling middleware

            var comic = new Comic
            {
                Title = comicDto.Title,
                PublisherId = comicDto.PublisherId
            };

            _context.Comics.Add(comic);
            await _context.SaveChangesAsync();

            comicDto.Id = comic.Id;
            return CreatedAtAction(nameof(GetComics), new { id = comic.Id }, comicDto);
        }

        [HttpGet]
        [Route("GetPublishers")]
        public async Task<ActionResult<IEnumerable<PublisherDto>>> GetPublishers()
        {
            return await _context.Publishers
                .Select(p => new PublisherDto
                {
                    Id = p.Id,
                    Name = p.Name
                })
                .ToListAsync();
        }

        [HttpPost]
        [Route("CreatePublisher")]
        public async Task<ActionResult<PublisherDto>> CreatePublisher(PublisherDto publisherDto)
        {
            if (await _helper.PublisherExistsAsync(publisherDto.Name))
            {
                return BadRequest($"Publisher with name '{publisherDto.Name}' already exists.");
            }

            var publisher = new Publisher
            {
                Name = publisherDto.Name
            };

            _context.Publishers.Add(publisher);
            await _context.SaveChangesAsync();

            publisherDto.Id = publisher.Id;
            return CreatedAtAction(nameof(GetPublishers), new { id = publisher.Id }, publisherDto);
        }

        [HttpGet]
        [Route("GetCharactersByComicId/{comicId}")]
        public async Task<ActionResult<IEnumerable<CharacterDto>>> GetCharactersByComicId(int comicId)
        {
            var characters = await _context.Characters
                .Where(c => c.ComicId == comicId)
                .Include(c => c.Comic)
                .Select(c => new CharacterDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    ComicId = c.ComicId,
                    ComicTitle = c.Comic.Title
                })
                .ToListAsync();

            if (!characters.Any())
            {
                return NotFound($"No characters found for ComicId {comicId}.");
            }

            return Ok(characters);
        }

        [HttpGet]
        [Route("GetComicsWithCharactersByPublisherId/{publisherId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetComicsWithCharactersByPublisherId(int publisherId)
        {
            var comics = await _context.Comics
                .Where(c => c.PublisherId == publisherId)
                .Include(c => c.Characters)
                .Select(c => new
                {
                    ComicId = c.Id,
                    ComicTitle = c.Title,
                    Characters = c.Characters.Select(ch => new
                    {
                        CharacterId = ch.Id,
                        CharacterName = ch.Name
                    }).ToList()
                })
                .ToListAsync();

            if (!comics.Any())
            {
                return NotFound($"No comics found for PublisherId {publisherId}.");
            }

            return Ok(comics);
        }

        [HttpPost]
        [Route("GenerateComicsAndCharactersForPublisher/{publisherId}")]
        public async Task<IActionResult> GenerateComicsAndCharactersForPublisher(int publisherId)
        {
            // Check if the publisher exists
            var publisher = await _context.Publishers.FirstOrDefaultAsync(p => p.Id == publisherId);
            //if (publisher == null)
            //{
            //    return NotFound($"Publisher with ID {publisherId} not found.");
            //}

            //without error handling middleware
            if (publisher == null) throw new Exception("publisher not found."); //with error handling middleware

            // Predefined DC Comics data
            var dcComicsData = new List<(string ComicTitle, List<string> Characters)>
    {
        ("Detective Comics", new List<string> { "Batman", "Robin", "Batgirl" }),
        ("Justice League", new List<string> { "Superman", "Wonder Woman", "The Flash", "Aquaman" }),
        ("Green Lantern", new List<string> { "Hal Jordan", "John Stewart", "Guy Gardner" }),
        ("The Flash", new List<string> { "Barry Allen", "Wally West" }),
        ("Wonder Woman", new List<string> { "Diana Prince", "Steve Trevor" })
    };

            // Lists to track skipped comics and characters
            var skippedComics = new List<string>();
            var skippedCharacters = new List<(string ComicTitle, string CharacterName)>();

            // Generate comics and characters
            foreach (var (comicTitle, characters) in dcComicsData)
            {
                // Check if the comic already exists
                if (await _helper.ComicExistsAsync(comicTitle))
                {
                    skippedComics.Add(comicTitle); // Track skipped comic
                    continue; // Skip adding this comic
                }

                // Create the comic
                var comic = new Comic
                {
                    Title = comicTitle,
                    PublisherId = publisherId
                };

                _context.Comics.Add(comic);
                await _context.SaveChangesAsync(); // Save to get the Comic ID

                // Create characters for the comic
                foreach (var characterName in characters)
                {
                    // Check if the character already exists in the comic
                    if (await _helper.CharacterExistsAsync(characterName, comic.Id))
                    {
                        skippedCharacters.Add((comicTitle, characterName)); // Track skipped character
                        continue; // Skip adding this character
                    }

                    var character = new Character
                    {
                        Name = characterName,
                        ComicId = comic.Id
                    };

                    _context.Characters.Add(character);
                }
            }

            // Save all characters
            await _context.SaveChangesAsync();

            // Return response with skipped comics and characters
            return Ok(new
            {
                Message = $"Comics and characters for publisher '{publisher.Name}' have been generated successfully.",
                SkippedComics = skippedComics,
                SkippedCharacters = skippedCharacters.Select(sc => new
                {
                    ComicTitle = sc.ComicTitle,
                    CharacterName = sc.CharacterName
                })
            });
        }
    }
}
