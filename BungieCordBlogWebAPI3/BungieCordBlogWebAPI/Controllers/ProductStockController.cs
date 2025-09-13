using BungieCordBlogWebAPI.Models.Domain;
using BungieCordBlogWebAPI.Models.DTO;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ProductStockController : ControllerBase
{
    private readonly IProductStockRepository repository;

    public ProductStockController(IProductStockRepository repository)
    {
        this.repository = repository;
    }

    // GET: api/productstock/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await repository.GetByIdAsync(id);
        if (product == null) return NotFound();

        var dto = new ProductStockDto
        {
            Id = product.Id,
            SuperHeroId = product.SuperHeroId,
            UnitPrice = product.UnitPrice,
            Quantity = product.Quantity,
            SKU = product.SKU,
            Description = product.Description,
            Currency = product.Currency,
            IsActive = product.IsActive,
            LastUpdated = product.LastUpdated
        };
        return Ok(dto);
    }

    // GET: api/productstock
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await repository.GetAllAsync();
        var dtos = products.Select(product => new ProductStockDto
        {
            Id = product.Id,
            SuperHeroId = product.SuperHeroId,
            UnitPrice = product.UnitPrice,
            Quantity = product.Quantity,
            SKU = product.SKU,
            Description = product.Description,
            Currency = product.Currency,
            IsActive = product.IsActive,
            LastUpdated = product.LastUpdated
        }).ToList();
        return Ok(dtos);
    }

    // POST: api/productstock
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] CreateProductStockDto dto)
    {
        var product = new ProductStock
        {
            SuperHeroId = dto.SuperHeroId,
            UnitPrice = dto.UnitPrice,
            Quantity = dto.Quantity,
            SKU = dto.SKU,
            Description = dto.Description,
            Currency = dto.Currency,
            IsActive = dto.IsActive,
            LastUpdated = DateTime.UtcNow
        };
        var created = await repository.AddAsync(product);
        var resultDto = new ProductStockDto
        {
            Id = created.Id,
            SuperHeroId = created.SuperHeroId,
            UnitPrice = created.UnitPrice,
            Quantity = created.Quantity,
            SKU = created.SKU,
            Description = created.Description,
            Currency = created.Currency,
            IsActive = created.IsActive,
            LastUpdated = created.LastUpdated
        };
        return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
    }

    // PUT: api/productstock/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductStockDto dto)
    {
        var product = new ProductStock
        {
            UnitPrice = dto.UnitPrice,
            Quantity = dto.Quantity,
            SKU = dto.SKU,
            Description = dto.Description,
            Currency = dto.Currency,
            IsActive = dto.IsActive,
            LastUpdated = DateTime.UtcNow
        };
        var updated = await repository.UpdateAsync(id, product);
        if (updated == null) return NotFound();

        var resultDto = new ProductStockDto
        {
            Id = updated.Id,
            SuperHeroId = updated.SuperHeroId,
            UnitPrice = updated.UnitPrice,
            Quantity = updated.Quantity,
            SKU = updated.SKU,
            Description = updated.Description,
            Currency = updated.Currency,
            IsActive = updated.IsActive,
            LastUpdated = updated.LastUpdated
        };
        return Ok(resultDto);
    }

    // DELETE: api/productstock/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await repository.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }

    // GET: api/productstock/by-superhero/{superHeroId}
    [HttpGet("by-superhero/{superHeroId:guid}")]
    public async Task<IActionResult> GetBySuperHeroId(Guid superHeroId)
    {
        var products = await repository.GetAllAsync();
        var product = products.FirstOrDefault(p => p.SuperHeroId == superHeroId);

        ProductStockDto dto;
        if (product == null)
        {
            dto = new ProductStockDto
            {
                Id = Guid.Empty,
                SuperHeroId = superHeroId,
                UnitPrice = 0,
                Quantity = 0,
                SKU = "N/A",
                Description = "No product found for this superhero.",
                Currency = "N/A",
                IsActive = false,
                LastUpdated = DateTime.MinValue
            };
        }
        else
        {
            dto = new ProductStockDto
            {
                Id = product.Id,
                SuperHeroId = product.SuperHeroId,
                UnitPrice = product.UnitPrice,
                Quantity = product.Quantity,
                SKU = product.SKU,
                Description = product.Description,
                Currency = product.Currency,
                IsActive = product.IsActive,
                LastUpdated = product.LastUpdated
            };
        }

        return Ok(dto);
    }
}