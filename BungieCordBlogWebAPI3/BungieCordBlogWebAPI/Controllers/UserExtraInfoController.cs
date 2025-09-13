using BungieCordBlogWebAPI.Models.Domain;
using BungieCordBlogWebAPI.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace BungieCordBlogWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserExtraInfoController : ControllerBase
    {
        private readonly IUserExtraInfoRepository userExtraInfoRepository;

        public UserExtraInfoController(IUserExtraInfoRepository userExtraInfoRepository)
        {
            this.userExtraInfoRepository = userExtraInfoRepository;
        }

        // GET: api/userextrainfo/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await userExtraInfoRepository.GetByIdAsync(id);
            if (user == null) return NotFound();

            var dto = new UserExtraInfoDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                Address = user.Address,
                RegisteredDate = user.RegisteredDate,
                IsActive = user.IsActive,
                ProfileImageUrl = user.ProfileImageUrl
            };

            return Ok(dto);
        }

        // GET: api/userextrainfo/by-email/{email}
        [HttpGet("by-email/{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            var user = await userExtraInfoRepository.GetByEmailAsync(email);
            if (user == null) return NotFound();

            var dto = new UserExtraInfoDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                Address = user.Address,
                RegisteredDate = user.RegisteredDate,
                IsActive = user.IsActive,
                ProfileImageUrl = user.ProfileImageUrl
            };

            return Ok(dto);
        }

        // GET: api/userextrainfo
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await userExtraInfoRepository.GetAllAsync();
            var dtos = users.Select(user => new UserExtraInfoDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                Address = user.Address,
                RegisteredDate = user.RegisteredDate,
                IsActive = user.IsActive,
                ProfileImageUrl = user.ProfileImageUrl
            }).ToList();

            return Ok(dtos);
        }

        // POST: api/userextrainfo
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateUserExtraInfoDto dto)
        {
            var user = new User_Extra_Info
            {
                Id = Guid.NewGuid(),
                Email = dto.Email,
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Role = dto.Role,
                Address = dto.Address,
                RegisteredDate = DateTime.UtcNow,
                IsActive = dto.IsActive,
                ProfileImageUrl = dto.ProfileImageUrl
            };

            var created = await userExtraInfoRepository.AddAsync(user);

            var resultDto = new UserExtraInfoDto
            {
                Id = created.Id,
                Email = created.Email,
                FullName = created.FullName,
                PhoneNumber = created.PhoneNumber,
                Role = created.Role,
                Address = created.Address,
                RegisteredDate = created.RegisteredDate,
                IsActive = created.IsActive,
                ProfileImageUrl = created.ProfileImageUrl
            };

            return CreatedAtAction(nameof(GetById), new { id = resultDto.Id }, resultDto);
        }

        // PUT: api/userextrainfo/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserExtraInfoDto dto)
        {
            var existing = await userExtraInfoRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            existing.FullName = dto.FullName;
            existing.PhoneNumber = dto.PhoneNumber;
            existing.Role = dto.Role;
            existing.Address = dto.Address;
            existing.IsActive = dto.IsActive;
            existing.ProfileImageUrl = dto.ProfileImageUrl;

            var updated = await userExtraInfoRepository.UpdateAsync(id, existing);
            if (updated == null) return NotFound();

            var resultDto = new UserExtraInfoDto
            {
                Id = updated.Id,
                Email = updated.Email,
                FullName = updated.FullName,
                PhoneNumber = updated.PhoneNumber,
                Role = updated.Role,
                Address = updated.Address,
                RegisteredDate = updated.RegisteredDate,
                IsActive = updated.IsActive,
                ProfileImageUrl = updated.ProfileImageUrl
            };

            return Ok(resultDto);
        }

        // DELETE: api/userextrainfo/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await userExtraInfoRepository.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }


    // For returning user info
    public class UserExtraInfoDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public string Address { get; set; }
        public DateTime RegisteredDate { get; set; }
        public bool IsActive { get; set; }
        public string ProfileImageUrl { get; set; }
    }

    // For creating a new user
    public class CreateUserExtraInfoDto
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; }
        public string ProfileImageUrl { get; set; }
    }

    // For updating an existing user
    public class UpdateUserExtraInfoDto
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; }
        public string ProfileImageUrl { get; set; }
    }

}