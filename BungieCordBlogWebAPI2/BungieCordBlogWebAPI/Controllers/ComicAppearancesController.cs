using BungieCordBlogWebAPI.Models.Domain;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ComicAppearancesController : ControllerBase
{
    private readonly IComicAppearanceRepository repository;

    public ComicAppearancesController(IComicAppearanceRepository repository)
    {
        this.repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var comics = await repository.GetAllAsync();
        var dtos = comics.Select(c => new ComicAppearanceDto
        {
            Id = c.Id,
            ComicTitle = c.ComicTitle,
            IssueNumber = c.IssueNumber,
            ReleaseDate = c.ReleaseDate,
            SuperHeroId = c.SuperHeroId
        });
        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var comic = await repository.GetByIdAsync(id);
        if (comic == null) return NotFound();

        var dto = new ComicAppearanceDto
        {
            Id = comic.Id,
            ComicTitle = comic.ComicTitle,
            IssueNumber = comic.IssueNumber,
            ReleaseDate = comic.ReleaseDate,
            SuperHeroId = comic.SuperHeroId
        };
        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateComicAppearanceDto dto)
    {
        var comic = new ComicAppearance
        {
            ComicTitle = dto.ComicTitle,
            IssueNumber = dto.IssueNumber,
            ReleaseDate = dto.ReleaseDate,
            SuperHeroId = dto.SuperHeroId
        };
        var created = await repository.AddAsync(comic);

        var resultDto = new ComicAppearanceDto
        {
            Id = created.Id,
            ComicTitle = created.ComicTitle,
            IssueNumber = created.IssueNumber,
            ReleaseDate = created.ReleaseDate,
            SuperHeroId = created.SuperHeroId
        };
        return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateComicAppearanceDto dto)
    {
        var comic = new ComicAppearance
        {
            ComicTitle = dto.ComicTitle,
            IssueNumber = dto.IssueNumber,
            ReleaseDate = dto.ReleaseDate,
            SuperHeroId = dto.SuperHeroId
        };
        var updated = await repository.UpdateAsync(id, comic);
        if (updated == null) return NotFound();

        var resultDto = new ComicAppearanceDto
        {
            Id = updated.Id,
            ComicTitle = updated.ComicTitle,
            IssueNumber = updated.IssueNumber,
            ReleaseDate = updated.ReleaseDate,
            SuperHeroId = updated.SuperHeroId
        };
        return Ok(resultDto);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await repository.DeleteAsync(id);
        if (deleted == null) return NotFound();

        var resultDto = new ComicAppearanceDto
        {
            Id = deleted.Id,
            ComicTitle = deleted.ComicTitle,
            IssueNumber = deleted.IssueNumber,
            ReleaseDate = deleted.ReleaseDate,
            SuperHeroId = deleted.SuperHeroId
        };
        return Ok(resultDto);
    }
}