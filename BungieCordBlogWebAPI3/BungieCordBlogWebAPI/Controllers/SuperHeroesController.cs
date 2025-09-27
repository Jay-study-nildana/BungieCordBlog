using BungieCordBlogWebAPI.Models.Domain;
using BungieCordBlogWebAPI.Models.DTO;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class SuperHeroesController : ControllerBase
{
    private readonly ISuperHeroRepository repository;
    private readonly IProductUserInfoRepository productUserInfoRepository;
    private readonly UserManager<IdentityUser> userManager;

    public SuperHeroesController(
        ISuperHeroRepository repository,
        IProductUserInfoRepository productUserInfoRepository,
        UserManager<IdentityUser> userManager)
    {
        this.repository = repository;
        this.productUserInfoRepository = productUserInfoRepository;
        this.userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var heroes = await repository.GetAllAsync();
        var dtos = heroes.Select(h => new SuperHeroDto
        {
            Id = h.Id,
            Name = h.Name,
            Alias = h.Alias,
            Age = h.Age,
            Origin = h.Origin,
            FirstAppearance = h.FirstAppearance,
            IsActive = h.IsActive
        });
        return Ok(dtos);
    }

    [HttpGet("user-superheroes")]
    [Authorize]
    public async Task<IActionResult> GetUserSuperHeroes()
    {
        // Get email from JWT token
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
            return Unauthorized("Email not found in token.");

        // Find the user by email
        var identityUser = await userManager.FindByEmailAsync(email);
        if (identityUser == null)
            return Unauthorized("User not found.");

        // Convert identityUser.Id to Guid
        if (!Guid.TryParse(identityUser.Id, out var userGuid))
            return Unauthorized("User ID is not a valid GUID.");

        // Get all ProductUserInfo for this user
        var productUserInfos = await productUserInfoRepository.GetByUserIdAsync(userGuid);

        var dtos = new List<SuperHeroDto>();
        foreach (var info in productUserInfos)
        {
            var hero = await repository.GetByIdAsync(info.ProductId);
            if (hero != null)
            {
                dtos.Add(new SuperHeroDto
                {
                    Id = hero.Id,
                    Name = hero.Name,
                    Alias = hero.Alias,
                    Age = hero.Age,
                    Origin = hero.Origin,
                    FirstAppearance = hero.FirstAppearance,
                    IsActive = hero.IsActive
                });
            }
        }

        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var hero = await repository.GetByIdAsync(id);
        if (hero == null) return NotFound();

        var dto = new SuperHeroDto
        {
            Id = hero.Id,
            Name = hero.Name,
            Alias = hero.Alias,
            Age = hero.Age,
            Origin = hero.Origin,
            FirstAppearance = hero.FirstAppearance,
            IsActive = hero.IsActive
        };
        return Ok(dto);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateSuperHeroDto dto)
    {
        // Get email from JWT token
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(email))
            return Unauthorized("Email not found in token.");

        // Find the user by email
        var identityUser = await userManager.FindByEmailAsync(email);
        if (identityUser == null)
            return Unauthorized("User not found.");

        // Convert identityUser.Id to Guid
        if (!Guid.TryParse(identityUser.Id, out var userGuid))
            return Unauthorized("User ID is not a valid GUID.");

        var hero = new SuperHero
        {
            Name = dto.Name,
            Alias = dto.Alias,
            Age = dto.Age,
            Origin = dto.Origin,
            FirstAppearance = dto.FirstAppearance,
            IsActive = dto.IsActive
        };
        var created = await repository.AddAsync(hero);

        // Create ProductUserInfo record
        var productUserInfo = new ProductUserInfo
        {
            ProductId = created.Id,
            UserId = userGuid,
            Email = email,
            Notes = $"SuperHero {created.Name} created by {email}.",
            IsActive = true,
            AddedDate = DateTime.UtcNow
        };
        await productUserInfoRepository.AddAsync(productUserInfo);

        var resultDto = new SuperHeroDto
        {
            Id = created.Id,
            Name = created.Name,
            Alias = created.Alias,
            Age = created.Age,
            Origin = created.Origin,
            FirstAppearance = created.FirstAppearance,
            IsActive = created.IsActive
        };
        return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSuperHeroDto dto)
    {
        var hero = new SuperHero
        {
            Name = dto.Name,
            Alias = dto.Alias,
            Age = dto.Age,
            Origin = dto.Origin,
            FirstAppearance = dto.FirstAppearance,
            IsActive = dto.IsActive
        };
        var updated = await repository.UpdateAsync(id, hero);
        if (updated == null) return NotFound();

        var resultDto = new SuperHeroDto
        {
            Id = updated.Id,
            Name = updated.Name,
            Alias = updated.Alias,
            Age = updated.Age,
            Origin = updated.Origin,
            FirstAppearance = updated.FirstAppearance,
            IsActive = updated.IsActive
        };
        return Ok(resultDto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await repository.DeleteAsync(id);
        if (deleted == null) return NotFound();

        var resultDto = new SuperHeroDto
        {
            Id = deleted.Id,
            Name = deleted.Name,
            Alias = deleted.Alias,
            Age = deleted.Age,
            Origin = deleted.Origin,
            FirstAppearance = deleted.FirstAppearance,
            IsActive = deleted.IsActive
        };
        return Ok(resultDto);
    }

    public class ImageUploadRequest
    {
        [FromForm]
        public IFormFile file { get; set; }
        [FromForm]
        public Guid superhero_id { get; set; }
        [FromForm]
        public string title { get; set; }
    }

    [HttpPost("{superhero_id:guid}/upload-image-for-superhero")]
    public async Task<IActionResult> UploadImage(ImageUploadRequest imageUploadRequest)
    {
        IFormFile file = imageUploadRequest.file;
        Guid id = imageUploadRequest.superhero_id;
        string title = imageUploadRequest.title;

        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var createdImage = await repository.SaveSuperHeroImageAsync(id, file, title);
        return Ok(createdImage);
    }

    [HttpGet("{superheroId:guid}/images")]
    public async Task<IActionResult> GetImagesForSuperHero(Guid superheroId)
    {
        var images = await repository.GetImagesForSuperHeroAsync(superheroId);
        return Ok(images);
    }
}
