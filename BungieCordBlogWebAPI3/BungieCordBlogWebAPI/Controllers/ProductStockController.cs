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
            // Create a new ProductStock entity with default values
            var newProduct = new ProductStock
            {
                SuperHeroId = superHeroId,
                UnitPrice = 0,
                Quantity = 0,
                SKU = "Please update SKU",
                Description = "No product found for this superhero. Add a description",
                Currency = "Update Currency",
                IsActive = false,
                LastUpdated = DateTime.UtcNow
            };

            // Add the new product to the database
            var createdProduct = await repository.AddAsync(newProduct);

            // Map to DTO
            dto = new ProductStockDto
            {
                Id = createdProduct.Id,
                SuperHeroId = createdProduct.SuperHeroId,
                UnitPrice = createdProduct.UnitPrice,
                Quantity = createdProduct.Quantity,
                SKU = createdProduct.SKU,
                Description = createdProduct.Description,
                Currency = createdProduct.Currency,
                IsActive = createdProduct.IsActive,
                LastUpdated = createdProduct.LastUpdated
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

    // PATCH: api/productstock/{id}/increase
    [HttpPatch("{id:guid}/increase")]
    public async Task<IActionResult> IncreaseStock(Guid id, [FromQuery] int amount)
    {
        var updated = await repository.IncreaseStockAsync(id, amount);
        if (updated == null) return BadRequest("Invalid product or amount.");

        var dto = new ProductStockDto
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
        return Ok(dto);
    }

    // PATCH: api/productstock/{id}/decrease
    [HttpPatch("{id:guid}/decrease")]
    public async Task<IActionResult> DecreaseStock(Guid id, [FromQuery] int amount)
    {
        var updated = await repository.DecreaseStockAsync(id, amount);
        if (updated == null) return BadRequest("Invalid product, amount, or insufficient stock.");

        var dto = new ProductStockDto
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
        return Ok(dto);
    }

    // PATCH: api/productstock/{id}/disable
    [HttpPatch("{id:guid}/disable")]
    public async Task<IActionResult> DisableProduct(Guid id)
    {
        var updated = await repository.DisableProductAsync(id);
        if (updated == null) return NotFound();

        var dto = new ProductStockDto
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
        return Ok(dto);
    }

    // PATCH: api/productstock/{id}/enable
    [HttpPatch("{id:guid}/enable")]
    public async Task<IActionResult> EnableProduct(Guid id)
    {
        var updated = await repository.EnableProductAsync(id);
        if (updated == null) return NotFound();

        var dto = new ProductStockDto
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
        return Ok(dto);
    }
}