using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Data;
using Microsoft.Data.SqlClient;
using WebAPIApril2025.DTOs;

namespace WebAPIApril2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RemakeCharactersControllerADO : ControllerBase
    {
        private readonly string _connectionString;
        private readonly IMemoryCache _cache;

        public RemakeCharactersControllerADO(IConfiguration configuration, IMemoryCache cache)
        {
            _connectionString = configuration.GetConnectionString("ConnectionString");
            _cache = cache;
        }

        [HttpGet]
        [Route("GetCharacters")]
        public async Task<ActionResult<IEnumerable<CharacterDto>>> GetCharacters()
        {
            try
            {
                var characters = new List<CharacterDto>();

                using (var connection = new SqlConnection(_connectionString))
                {
                    var query = @"
                        SELECT c.Id, c.Name, c.ComicId, co.Title AS ComicTitle 
                        FROM Characters c 
                        INNER JOIN Comics co ON c.ComicId = co.Id";

                    var command = new SqlCommand(query, connection);
                    await connection.OpenAsync();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            characters.Add(new CharacterDto
                            {
                                Id = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                ComicId = reader.GetInt32(2),
                                ComicTitle = reader.GetString(3)
                            });
                        }
                    }
                }

                return Ok(characters);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while retrieving characters.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet]
        [Route("GetCharactersWithCache")]
        public async Task<ActionResult<IEnumerable<CharacterDto>>> GetCharactersWithCache()
        {
            const string cacheKey = "GetCharactersCache";

            try
            {
                if (!_cache.TryGetValue(cacheKey, out List<CharacterDto> cachedCharacters))
                {
                    var charactersResult = await GetCharacters();

                    if (charactersResult.Result is OkObjectResult okResult)
                    {
                        cachedCharacters = okResult.Value as List<CharacterDto>;

                        var cacheOptions = new MemoryCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                            SlidingExpiration = TimeSpan.FromMinutes(5)
                        };

                        _cache.Set(cacheKey, cachedCharacters, cacheOptions);
                    }
                    else
                    {
                        return charactersResult;
                    }
                }

                return Ok(cachedCharacters);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while retrieving cached characters.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("CreateCharacter")]
        public async Task<ActionResult<CharacterDto>> CreateCharacter(CharacterDto characterDto)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    // Validate if ComicId exists
                    var validateCommand = new SqlCommand("SELECT COUNT(1) FROM Comics WHERE Id = @ComicId", connection);
                    validateCommand.Parameters.AddWithValue("@ComicId", characterDto.ComicId);

                    await connection.OpenAsync();
                    var comicExists = (int)await validateCommand.ExecuteScalarAsync() > 0;

                    if (!comicExists)
                    {
                        return BadRequest($"Comic with Id {characterDto.ComicId} does not exist.");
                    }

                    // Create character
                    var command = new SqlCommand("usp_CreateCharacter", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@Name", characterDto.Name);
                    command.Parameters.AddWithValue("@ComicId", characterDto.ComicId);

                    var outputId = new SqlParameter("@Id", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    command.Parameters.Add(outputId);

                    await command.ExecuteNonQueryAsync();

                    characterDto.Id = (int)outputId.Value;

                    // Invalidate cache
                    const string cacheKey = "GetCharactersCache";
                    _cache.Remove(cacheKey);
                }

                return CreatedAtAction(nameof(GetCharactersWithCache), new { id = characterDto.Id }, characterDto);
            }
            catch (SqlException sqlEx)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "A database error occurred while creating the character.",
                    Details = sqlEx.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An unexpected error occurred while creating the character.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet]
        [Route("GetComics")]
        public async Task<ActionResult<IEnumerable<ComicDto>>> GetComics()
        {
            try
            {
                var comics = new List<ComicDto>();

                using (var connection = new SqlConnection(_connectionString))
                {
                    var query = "SELECT Id, Title, PublisherId FROM Comics";
                    var command = new SqlCommand(query, connection);

                    await connection.OpenAsync();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            comics.Add(new ComicDto
                            {
                                Id = reader.GetInt32(0),
                                Title = reader.GetString(1),
                                PublisherId = reader.GetInt32(2)
                            });
                        }
                    }
                }

                return Ok(comics);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while retrieving comics.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("CreateComic")]
        public async Task<ActionResult<ComicDto>> CreateComic(ComicDto comicDto)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    // Validate if PublisherId exists
                    var validateCommand = new SqlCommand("SELECT COUNT(1) FROM Publishers WHERE Id = @PublisherId", connection);
                    validateCommand.Parameters.AddWithValue("@PublisherId", comicDto.PublisherId);

                    await connection.OpenAsync();
                    var publisherExists = (int)await validateCommand.ExecuteScalarAsync() > 0;

                    if (!publisherExists)
                    {
                        return BadRequest($"Publisher with Id {comicDto.PublisherId} does not exist.");
                    }

                    // Insert Comic
                    var command = new SqlCommand(@"
                        INSERT INTO Comics (Title, PublisherId) 
                        VALUES (@Title, @PublisherId);
                        SELECT CAST(SCOPE_IDENTITY() AS INT);", connection);

                    command.Parameters.AddWithValue("@Title", comicDto.Title);
                    command.Parameters.AddWithValue("@PublisherId", comicDto.PublisherId);

                    comicDto.Id = (int)await command.ExecuteScalarAsync();
                }

                return CreatedAtAction(nameof(GetComics), new { id = comicDto.Id }, comicDto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while creating the comic.",
                    Details = ex.Message
                });
            }
        }
    [HttpGet]
        [Route("GetPublishers")]
        public async Task<ActionResult<IEnumerable<PublisherDto>>> GetPublishers()
        {
            try
            {
                var publishers = new List<PublisherDto>();

                using (var connection = new SqlConnection(_connectionString))
                {
                    var query = "SELECT Id, Name FROM Publishers";
                    var command = new SqlCommand(query, connection);

                    await connection.OpenAsync();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            publishers.Add(new PublisherDto
                            {
                                Id = reader.GetInt32(0),
                                Name = reader.GetString(1)
                            });
                        }
                    }
                }

                return Ok(publishers);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while retrieving publishers.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("CreatePublisher")]
        public async Task<ActionResult<PublisherDto>> CreatePublisher(PublisherDto publisherDto)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    // Check if the publisher already exists
                    var validateCommand = new SqlCommand("SELECT COUNT(1) FROM Publishers WHERE Name = @Name", connection);
                    validateCommand.Parameters.AddWithValue("@Name", publisherDto.Name);

                    await connection.OpenAsync();
                    var exists = (int)await validateCommand.ExecuteScalarAsync() > 0;

                    if (exists)
                    {
                        return BadRequest($"Publisher with name '{publisherDto.Name}' already exists.");
                    }

                    // Insert the publisher
                    var command = new SqlCommand(@"
                        INSERT INTO Publishers (Name)
                        VALUES (@Name);
                        SELECT CAST(SCOPE_IDENTITY() AS INT);", connection);

                    command.Parameters.AddWithValue("@Name", publisherDto.Name);

                    publisherDto.Id = (int)await command.ExecuteScalarAsync();
                }

                return CreatedAtAction(nameof(GetPublishers), new { id = publisherDto.Id }, publisherDto);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while creating the publisher.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet]
        [Route("GetCharactersByComicId/{comicId}")]
        public async Task<ActionResult<IEnumerable<CharacterDto>>> GetCharactersByComicId(int comicId)
        {
            try
            {
                var characters = new List<CharacterDto>();

                using (var connection = new SqlConnection(_connectionString))
                {
                    var query = @"
                        SELECT c.Id, c.Name, c.ComicId, co.Title AS ComicTitle
                        FROM Characters c
                        INNER JOIN Comics co ON c.ComicId = co.Id
                        WHERE c.ComicId = @ComicId";

                    var command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@ComicId", comicId);

                    await connection.OpenAsync();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            characters.Add(new CharacterDto
                            {
                                Id = reader.GetInt32(0),
                                Name = reader.GetString(1),
                                ComicId = reader.GetInt32(2),
                                ComicTitle = reader.GetString(3)
                            });
                        }
                    }
                }

                if (characters.Count == 0)
                {
                    return NotFound($"No characters found for ComicId {comicId}.");
                }

                return Ok(characters);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while retrieving characters by ComicId.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet]
        [Route("GetComicsWithCharactersByPublisherId/{publisherId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetComicsWithCharactersByPublisherId(int publisherId)
        {
            try
            {
                var comicsWithCharacters = new List<object>();

                using (var connection = new SqlConnection(_connectionString))
                {
                    var query = @"
                        SELECT co.Id AS ComicId, co.Title AS ComicTitle, ch.Id AS CharacterId, ch.Name AS CharacterName
                        FROM Comics co
                        INNER JOIN Characters ch ON co.Id = ch.ComicId
                        WHERE co.PublisherId = @PublisherId";

                    var command = new SqlCommand(query, connection);
                    command.Parameters.AddWithValue("@PublisherId", publisherId);

                    await connection.OpenAsync();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var comicId = reader.GetInt32(0);
                            var comicTitle = reader.GetString(1);
                            var characterId = reader.GetInt32(2);
                            var characterName = reader.GetString(3);

                            comicsWithCharacters.Add(new
                            {
                                ComicId = comicId,
                                ComicTitle = comicTitle,
                                Characters = new List<object>
                                {
                                    new
                                    {
                                        CharacterId = characterId,
                                        CharacterName = characterName
                                    }
                                }
                            });
                        }
                    }
                }

                if (comicsWithCharacters.Count == 0)
                {
                    return NotFound($"No comics found for PublisherId {publisherId}.");
                }

                return Ok(comicsWithCharacters);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while retrieving comics with characters by PublisherId.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost]
        [Route("GenerateComicsAndCharactersForPublisher/{publisherId}")]
        public async Task<IActionResult> GenerateComicsAndCharactersForPublisher(int publisherId)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    // Check if the publisher exists
                    var validateCommand = new SqlCommand("SELECT COUNT(1) FROM Publishers WHERE Id = @PublisherId", connection);
                    validateCommand.Parameters.AddWithValue("@PublisherId", publisherId);

                    await connection.OpenAsync();
                    var publisherExists = (int)await validateCommand.ExecuteScalarAsync() > 0;

                    if (!publisherExists)
                    {
                        return NotFound($"Publisher with ID {publisherId} not found.");
                    }

                    // Predefined data for comics and characters
                    var predefinedData = new List<(string ComicTitle, List<string> Characters)>
                    {
                        ("Detective Comics", new List<string> { "Batman", "Robin", "Batgirl" }),
                        ("Justice League", new List<string> { "Superman", "Wonder Woman", "The Flash", "Aquaman" }),
                        ("Green Lantern", new List<string> { "Hal Jordan", "John Stewart", "Guy Gardner" }),
                        ("The Flash", new List<string> { "Barry Allen", "Wally West" }),
                        ("Wonder Woman", new List<string> { "Diana Prince", "Steve Trevor" })
                    };

                    // Track skipped comics and characters
                    var skippedComics = new List<string>();
                    var skippedCharacters = new List<(string ComicTitle, string CharacterName)>();

                    foreach (var (comicTitle, characters) in predefinedData)
                    {
                        // Check if the comic exists
                        var checkComicCommand = new SqlCommand("SELECT COUNT(1) FROM Comics WHERE Title = @Title", connection);
                        checkComicCommand.Parameters.AddWithValue("@Title", comicTitle);

                        var comicExists = (int)await checkComicCommand.ExecuteScalarAsync() > 0;

                        if (comicExists)
                        {
                            skippedComics.Add(comicTitle);
                            continue;
                        }

                        // Insert the comic
                        var insertComicCommand = new SqlCommand(@"
                            INSERT INTO Comics (Title, PublisherId)
                            VALUES (@Title, @PublisherId);
                            SELECT CAST(SCOPE_IDENTITY() AS INT);", connection);

                        insertComicCommand.Parameters.AddWithValue("@Title", comicTitle);
                        insertComicCommand.Parameters.AddWithValue("@PublisherId", publisherId);

                        var comicId = (int)await insertComicCommand.ExecuteScalarAsync();

                        foreach (var characterName in characters)
                        {
                            // Check if the character exists
                            var checkCharacterCommand = new SqlCommand(@"
                                SELECT COUNT(1) 
                                FROM Characters 
                                WHERE Name = @Name AND ComicId = @ComicId", connection);

                            checkCharacterCommand.Parameters.AddWithValue("@Name", characterName);
                            checkCharacterCommand.Parameters.AddWithValue("@ComicId", comicId);

                            var characterExists = (int)await checkCharacterCommand.ExecuteScalarAsync() > 0;

                            if (characterExists)
                            {
                                skippedCharacters.Add((comicTitle, characterName));
                                continue;
                            }

                            // Insert the character
                            var insertCharacterCommand = new SqlCommand(@"
                                INSERT INTO Characters (Name, ComicId)
                                VALUES (@Name, @ComicId)", connection);

                            insertCharacterCommand.Parameters.AddWithValue("@Name", characterName);
                            insertCharacterCommand.Parameters.AddWithValue("@ComicId", comicId);

                            await insertCharacterCommand.ExecuteNonQueryAsync();
                        }
                    }

                    return Ok(new
                    {
                        Message = "Comics and characters generated successfully.",
                        SkippedComics = skippedComics,
                        SkippedCharacters = skippedCharacters
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "An error occurred while generating comics and characters for the publisher.",
                    Details = ex.Message
                });
            }
        }
    }
}