using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zoo.Data;
using Zoo.Models.Domain;

namespace Zoo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZooKeeperController : ControllerBase
    {

        private readonly ApplicationDbContext dbContext;

        public ZooKeeperController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        [Route("AddZooKeeper")]
        public async Task<IActionResult> AddZooKeeper([FromBody] ZooKeeper zooKeeper)
        {
            await dbContext.ZooKeepers.AddAsync(zooKeeper);
            await dbContext.SaveChangesAsync();
            return Ok(zooKeeper);
        }

        [HttpGet]
        [Route("GetZookeepers")]
        public async Task<IActionResult> GetZookeepers()
        {
            var response = await dbContext.ZooKeepers.ToListAsync();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetZooKeeper/{id}")]
        public async Task<IActionResult> GetZooKeeper(int id)
        {
            var zooKeeper = await dbContext.ZooKeepers.FindAsync(id);
            if (zooKeeper == null)
            {
                return NotFound($"ZooKeeper with Id {id} not found.");
            }
            return Ok(zooKeeper);
        }

        [HttpDelete]
        [Route("DeleteZooKeeper/{id}")]
        public async Task<IActionResult> DeleteZooKeeper(int id)
        {
            var zooKeeper = await dbContext.ZooKeepers.FindAsync(id);
            if (zooKeeper == null)
            {
                return NotFound($"ZooKeeper with Id {id} not found.");
            }

            dbContext.ZooKeepers.Remove(zooKeeper);
            await dbContext.SaveChangesAsync();

            return Ok($"ZooKeeper with Id {id} has been deleted.");
        }

        [HttpDelete]
        [Route("DeleteZooKeeperByName/{name}")]
        public async Task<IActionResult> DeleteZooKeeperByName(string name)
        {
            var zooKeeper = await dbContext.ZooKeepers.FirstOrDefaultAsync(z => z.Name == name);
            if (zooKeeper == null)
            {
                return NotFound($"ZooKeeper with Name '{name}' not found.");
            }

            dbContext.ZooKeepers.Remove(zooKeeper);
            await dbContext.SaveChangesAsync();

            return Ok($"ZooKeeper with Name '{name}' has been deleted.");
        }

        [HttpDelete]
        [Route("DeleteZooKeeperByContactNumber/{contactNumber}")]
        public async Task<IActionResult> DeleteZooKeeperByContactNumber(string contactNumber)
        {
            var zooKeeper = await dbContext.ZooKeepers.FirstOrDefaultAsync(z => z.ContactNumber == contactNumber);
            if (zooKeeper == null)
            {
                return NotFound($"ZooKeeper with Contact Number '{contactNumber}' not found.");
            }

            dbContext.ZooKeepers.Remove(zooKeeper);
            await dbContext.SaveChangesAsync();

            return Ok($"ZooKeeper with Contact Number '{contactNumber}' has been deleted.");
        }

        [HttpPut]
        [Route("UpdateZooKeeper/{id}")]
        public async Task<IActionResult> UpdateZooKeeper(int id, [FromBody] ZooKeeper updatedZooKeeper)
        {
            var existingZooKeeper = await dbContext.ZooKeepers.FindAsync(id);
            if (existingZooKeeper == null)
            {
                return NotFound($"ZooKeeper with Id {id} not found.");
            }

            // Update the properties of the existing ZooKeeper
            existingZooKeeper.Name = updatedZooKeeper.Name;
            existingZooKeeper.Age = updatedZooKeeper.Age;
            existingZooKeeper.Role = updatedZooKeeper.Role;
            existingZooKeeper.ContactNumber = updatedZooKeeper.ContactNumber;

            await dbContext.SaveChangesAsync();

            return Ok(existingZooKeeper);
        }


    }
}
