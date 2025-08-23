using BungieCordBlogWebAPI.Models.Domain;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class SidekickComicAppearancesController : ControllerBase
{
    private readonly ISidekickComicAppearanceRepository repository;

    public SidekickComicAppearancesController(ISidekickComicAppearanceRepository repository)
    {
        this.repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var entities = await repository.GetAllAsync();
        var dtos = entities.Select(e => new SidekickComicAppearanceDto
        {
            SidekickId = e.SidekickId,
            ComicAppearanceId = e.ComicAppearanceId
        });
        return Ok(dtos);
    }

    [HttpGet("{sidekickId:guid}/{comicAppearanceId:guid}")]
    public async Task<IActionResult> GetByIds(Guid sidekickId, Guid comicAppearanceId)
    {
        var entity = await repository.GetByIdsAsync(sidekickId, comicAppearanceId);
        if (entity == null) return NotFound();

        var dto = new SidekickComicAppearanceDto
        {
            SidekickId = entity.SidekickId,
            ComicAppearanceId = entity.ComicAppearanceId
        };
        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSidekickComicAppearanceDto dto)
    {
        var entity = new SidekickComicAppearance
        {
            SidekickId = dto.SidekickId,
            ComicAppearanceId = dto.ComicAppearanceId
        };
        var created = await repository.AddAsync(entity);

        var resultDto = new SidekickComicAppearanceDto
        {
            SidekickId = created.SidekickId,
            ComicAppearanceId = created.ComicAppearanceId
        };
        return CreatedAtAction(nameof(GetByIds), new { sidekickId = resultDto.SidekickId, comicAppearanceId = resultDto.ComicAppearanceId }, resultDto);
    }

    [HttpPut("{sidekickId:guid}/{comicAppearanceId:guid}")]
    public async Task<IActionResult> Update(Guid sidekickId, Guid comicAppearanceId, [FromBody] UpdateSidekickComicAppearanceDto dto)
    {
        var entity = new SidekickComicAppearance
        {
            SidekickId = dto.SidekickId,
            ComicAppearanceId = dto.ComicAppearanceId
        };
        var updated = await repository.UpdateAsync(sidekickId, comicAppearanceId, entity);
        if (updated == null) return NotFound();

        var resultDto = new SidekickComicAppearanceDto
        {
            SidekickId = updated.SidekickId,
            ComicAppearanceId = updated.ComicAppearanceId
        };
        return Ok(resultDto);
    }

    [HttpDelete("{sidekickId:guid}/{comicAppearanceId:guid}")]
    public async Task<IActionResult> Delete(Guid sidekickId, Guid comicAppearanceId)
    {
        var deleted = await repository.DeleteAsync(sidekickId, comicAppearanceId);
        if (deleted == null) return NotFound();

        var resultDto = new SidekickComicAppearanceDto
        {
            SidekickId = deleted.SidekickId,
            ComicAppearanceId = deleted.ComicAppearanceId
        };
        return Ok(resultDto);
    }
}