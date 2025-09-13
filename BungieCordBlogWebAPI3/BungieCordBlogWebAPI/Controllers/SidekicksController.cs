using BungieCordBlogWebAPI.Models.Domain;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SidekicksController : ControllerBase
{
    private readonly ISidekickRepository repository;

    public SidekicksController(ISidekickRepository repository)
    {
        this.repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var sidekicks = await repository.GetAllAsync();
        var dtos = sidekicks.Select(s => new SidekickDto
        {
            Id = s.Id,
            Name = s.Name,
            Age = s.Age,
            SuperHeroId = s.SuperHeroId
        });
        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var sidekick = await repository.GetByIdAsync(id);
        if (sidekick == null) return NotFound();

        var dto = new SidekickDto
        {
            Id = sidekick.Id,
            Name = sidekick.Name,
            Age = sidekick.Age,
            SuperHeroId = sidekick.SuperHeroId
        };
        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSidekickDto dto)
    {
        var sidekick = new Sidekick
        {
            Name = dto.Name,
            Age = dto.Age,
            SuperHeroId = dto.SuperHeroId
        };
        var created = await repository.AddAsync(sidekick);

        var resultDto = new SidekickDto
        {
            Id = created.Id,
            Name = created.Name,
            Age = created.Age,
            SuperHeroId = created.SuperHeroId
        };
        return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSidekickDto dto)
    {
        var sidekick = new Sidekick
        {
            Name = dto.Name,
            Age = dto.Age,
            SuperHeroId = dto.SuperHeroId
        };
        var updated = await repository.UpdateAsync(id, sidekick);
        if (updated == null) return NotFound();

        var resultDto = new SidekickDto
        {
            Id = updated.Id,
            Name = updated.Name,
            Age = updated.Age,
            SuperHeroId = updated.SuperHeroId
        };
        return Ok(resultDto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await repository.DeleteAsync(id);
        if (deleted == null) return NotFound();

        var resultDto = new SidekickDto
        {
            Id = deleted.Id,
            Name = deleted.Name,
            Age = deleted.Age,
            SuperHeroId = deleted.SuperHeroId
        };
        return Ok(resultDto);
    }

    [HttpGet("by-superhero/{superHeroId:guid}")]
    public async Task<IActionResult> GetBySuperHeroId(Guid superHeroId)
    {
        var sidekicks = await repository.GetBySuperHeroIdAsync(superHeroId);
        var dtos = sidekicks.Select(s => new SidekickDto
        {
            Id = s.Id,
            Name = s.Name,
            Age = s.Age,
            SuperHeroId = s.SuperHeroId
        });
        return Ok(dtos);
    }
}