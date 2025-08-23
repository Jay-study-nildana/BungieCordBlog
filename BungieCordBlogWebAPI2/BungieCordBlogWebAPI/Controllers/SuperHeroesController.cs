using BungieCordBlogWebAPI.Models.Domain;
using BungieCordBlogWebAPI.Models.DTO;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SuperHeroesController : ControllerBase
{
    private readonly ISuperHeroRepository repository;

    public SuperHeroesController(ISuperHeroRepository repository)
    {
        this.repository = repository;
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
    public async Task<IActionResult> Create([FromBody] CreateSuperHeroDto dto)
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
        var created = await repository.AddAsync(hero);

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
}
