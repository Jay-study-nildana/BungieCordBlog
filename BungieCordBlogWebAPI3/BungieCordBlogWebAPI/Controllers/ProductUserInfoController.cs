using BungieCordBlogWebAPI.Models.Domain;
using BungieCordBlogWebAPI.Models.DTO;
using BungieCordBlogWebAPI.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BungieCordBlogWebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductUserInfoController : ControllerBase
    {
        private readonly IProductUserInfoRepository repository;

        public ProductUserInfoController(IProductUserInfoRepository repository)
        {
            this.repository = repository;
        }

        // GET: api/productuserinfo/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var info = await repository.GetByIdAsync(id);
            if (info == null) return NotFound();

            var dto = new ProductUserInfoDto
            {
                Id = info.Id,
                ProductId = info.ProductId,
                UserId = info.UserId,
                Email = info.Email,
                AddedDate = info.AddedDate,
                IsActive = info.IsActive,
                Notes = info.Notes
            };
            return Ok(dto);
        }

        // GET: api/productuserinfo
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var infos = await repository.GetAllAsync();
            var dtos = infos.Select(info => new ProductUserInfoDto
            {
                Id = info.Id,
                ProductId = info.ProductId,
                UserId = info.UserId,
                Email = info.Email,
                AddedDate = info.AddedDate,
                IsActive = info.IsActive,
                Notes = info.Notes
            }).ToList();
            return Ok(dtos);
        }

        // POST: api/productuserinfo
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateProductUserInfoDto dto)
        {
            // Check if a ProductUserInfo with the given ProductId already exists
            var existingInfos = await repository.GetAllAsync();
            var existing = existingInfos.FirstOrDefault(info => info.ProductId == dto.ProductId);

            if (existing != null)
            {
                // Return the existing record
                var resultDto = new ProductUserInfoDto
                {
                    Id = existing.Id,
                    ProductId = existing.ProductId,
                    UserId = existing.UserId,
                    Email = existing.Email,
                    AddedDate = existing.AddedDate,
                    IsActive = existing.IsActive,
                    Notes = existing.Notes
                };
                return Ok(resultDto);
            }

            // If not found, create a new record
            var info = new ProductUserInfo
            {
                ProductId = dto.ProductId,
                UserId = dto.UserId,
                Email = dto.Email,
                Notes = dto.Notes,
                IsActive = true,
                AddedDate = DateTime.UtcNow
            };
            var created = await repository.AddAsync(info);
            var createdDto = new ProductUserInfoDto
            {
                Id = created.Id,
                ProductId = created.ProductId,
                UserId = created.UserId,
                Email = created.Email,
                AddedDate = created.AddedDate,
                IsActive = created.IsActive,
                Notes = created.Notes
            };
            return CreatedAtAction(nameof(GetById), new { id = createdDto.Id }, createdDto);
        }

        // PUT: api/productuserinfo/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductUserInfoDto dto)
        {
            var info = new ProductUserInfo
            {
                Notes = dto.Notes,
                IsActive = dto.IsActive
            };
            var updated = await repository.UpdateAsync(id, info);
            if (updated == null) return NotFound();

            var resultDto = new ProductUserInfoDto
            {
                Id = updated.Id,
                ProductId = updated.ProductId,
                UserId = updated.UserId,
                Email = updated.Email,
                AddedDate = updated.AddedDate,
                IsActive = updated.IsActive,
                Notes = updated.Notes
            };
            return Ok(resultDto);
        }

        // DELETE: api/productuserinfo/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await repository.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
