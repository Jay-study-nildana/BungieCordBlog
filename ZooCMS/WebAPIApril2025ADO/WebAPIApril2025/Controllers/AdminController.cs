using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPIApril2025.Data;
using WebAPIApril2025.Helpers;
using WebAPIApril2025.Services;

namespace WebAPIApril2025.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Route("ResetDatabase")]
        public async Task<IActionResult> ResetDatabase()
        {
            // Delete all data from the tables
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Characters");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Comics");
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM Publishers");

            // Optionally, reset identity columns (if using SQL Server)
            await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Characters', RESEED, 0)");
            await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Comics', RESEED, 0)");
            await _context.Database.ExecuteSqlRawAsync("DBCC CHECKIDENT ('Publishers', RESEED, 0)");

            return Ok("Database has been reset successfully.");
        }

    }
}
