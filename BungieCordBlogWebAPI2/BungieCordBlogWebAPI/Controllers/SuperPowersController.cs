using BungieCordBlogWebAPI.Models.Domain;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SuperPowersController : ControllerBase
{
    private readonly ISuperPowerRepository repository;

    public SuperPowersController(ISuperPowerRepository repository)
    {
        this.repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var powers = await repository.GetAllAsync();
        var dtos = powers.Select(p => new SuperPowerDto
        {
            Id = p.Id,
            PowerName = p.PowerName,
            Description = p.Description,
            SuperHeroId = p.SuperHeroId
        });
        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var power = await repository.GetByIdAsync(id);
        if (power == null) return NotFound();

        var dto = new SuperPowerDto
        {
            Id = power.Id,
            PowerName = power.PowerName,
            Description = power.Description,
            SuperHeroId = power.SuperHeroId
        };
        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSuperPowerDto dto)
    {
        var power = new SuperPower
        {
            PowerName = dto.PowerName,
            Description = dto.Description,
            SuperHeroId = dto.SuperHeroId
        };
        var created = await repository.AddAsync(power);

        var resultDto = new SuperPowerDto
        {
            Id = created.Id,
            PowerName = created.PowerName,
            Description = created.Description,
            SuperHeroId = created.SuperHeroId
        };
        return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSuperPowerDto dto)
    {
        var power = new SuperPower
        {
            PowerName = dto.PowerName,
            Description = dto.Description,
            SuperHeroId = dto.SuperHeroId
        };
        var updated = await repository.UpdateAsync(id, power);
        if (updated == null) return NotFound();

        var resultDto = new SuperPowerDto
        {
            Id = updated.Id,
            PowerName = updated.PowerName,
            Description = updated.Description,
            SuperHeroId = updated.SuperHeroId
        };
        return Ok(resultDto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await repository.DeleteAsync(id);
        if (deleted == null) return NotFound();

        var resultDto = new SuperPowerDto
        {
            Id = deleted.Id,
            PowerName = deleted.PowerName,
            Description = deleted.Description,
            SuperHeroId = deleted.SuperHeroId
        };
        return Ok(resultDto);
    }

    [HttpGet("by-superhero/{superHeroId:guid}")]
    public async Task<IActionResult> GetBySuperHeroId(Guid superHeroId)
    {
        var powers = await repository.GetBySuperHeroIdAsync(superHeroId);
        var dtos = powers.Select(p => new SuperPowerDto
        {
            Id = p.Id,
            PowerName = p.PowerName,
            Description = p.Description,
            SuperHeroId = p.SuperHeroId
        });
        return Ok(dtos);
    }
}