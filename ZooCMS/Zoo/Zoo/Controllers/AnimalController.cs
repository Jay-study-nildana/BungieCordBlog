using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Zoo.Data;
using Zoo.Models.Domain;

namespace Zoo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnimalController : ControllerBase
    {

        private readonly ApplicationDbContext dbContext;

        public AnimalController(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        [Route("AddAnimal")]
        public async Task<IActionResult> AddAnimal([FromBody] Animal animal)
        {

            await dbContext.Animals.AddAsync(animal);
            await dbContext.SaveChangesAsync();
            return Ok(animal);
        }

        [HttpGet]
        [Route("GetAnimals")]
        public async Task<IActionResult> GetAllAnimals()
        {
            var response = await dbContext.Animals.ToListAsync();
            return Ok(response);
        }

        [HttpGet]
        [Route("SyncDemo")]
        public string SyncDemo()
        {
            return "This is a synchronous method";
        }

        [HttpGet]
        [Route("GetAnimal/{id}")]
        public async Task<IActionResult> GetAnimal(int id)
        {
            Animal animal = await dbContext.Animals.FindAsync(id);

            if(animal == null)
            {
                return NotFound($"Animal with Id {id} not found.");
            }

            return Ok(animal);
        }

        [HttpPut]
        [Route("UpdateAnimal/{id}")]
        public async Task<IActionResult> UpdateAnimal(int id, [FromBody] Animal updatedanimal)
        {
            var existingAnimal = await dbContext.Animals.FindAsync(id);
            if(existingAnimal == null)
            {
                return NotFound($"Animal with Id {id} not found.");
            }

            existingAnimal.Name = updatedanimal.Name;
            existingAnimal.Habitat = updatedanimal.Habitat;
            existingAnimal.Age = updatedanimal.Age;
            existingAnimal.Species = updatedanimal.Species;

            await dbContext.SaveChangesAsync();

            return Ok(existingAnimal);
        }

        [HttpDelete]
        [Route("DeleteAnimal/{id}")]
        public async Task<IActionResult> DeleteAnimal(int id)
        {
            Animal animal = await dbContext.Animals.FindAsync(id);

            if (animal == null)
            {
                return NotFound($"Animal with Id {id} not found.");
            }

            dbContext.Animals.Remove(animal);
            await dbContext.SaveChangesAsync();
            return Ok($"Animal with Id {id} has been deleted");
        }
        //[HttpDelete]
        //[Route("DeleteZooKeeper/{id}")]
        //public async Task<IActionResult> DeleteZooKeeper(int id)
        //{
        //    var zooKeeper = await dbContext.ZooKeepers.FindAsync(id);
        //    if (zooKeeper == null)
        //    {
        //        return NotFound($"ZooKeeper with Id {id} not found.");
        //    }

        //    dbContext.ZooKeepers.Remove(zooKeeper);
        //    await dbContext.SaveChangesAsync();

        //    return Ok($"ZooKeeper with Id {id} has been deleted.");
        //}

        //[HttpPut]
        //[Route("UpdateZooKeeper/{id}")]
        //public async Task<IActionResult> UpdateZooKeeper(int id, [FromBody] ZooKeeper updatedZooKeeper)
        //{
        //    var existingZooKeeper = await dbContext.ZooKeepers.FindAsync(id);
        //    if (existingZooKeeper == null)
        //    {
        //        return NotFound($"ZooKeeper with Id {id} not found.");
        //    }

        //    // Update the properties of the existing ZooKeeper
        //    existingZooKeeper.Name = updatedZooKeeper.Name;
        //    existingZooKeeper.Age = updatedZooKeeper.Age;
        //    existingZooKeeper.Role = updatedZooKeeper.Role;
        //    existingZooKeeper.ContactNumber = updatedZooKeeper.ContactNumber;

        //    await dbContext.SaveChangesAsync();

        //    return Ok(existingZooKeeper);
        //}

        //[HttpDelete]
        //[Route("DeleteZooKeeper/{id}")]
        //public async Task<IActionResult> DeleteZooKeeper(int id)
        //{
        //    var zooKeeper = await dbContext.ZooKeepers.FindAsync(id);
        //    if (zooKeeper == null)
        //    {
        //        return NotFound($"ZooKeeper with Id {id} not found.");
        //    }

        //    dbContext.ZooKeepers.Remove(zooKeeper);
        //    await dbContext.SaveChangesAsync();

        //    return Ok($"ZooKeeper with Id {id} has been deleted.");
        //}



        //[HttpGet]
        //[Route("GetZooKeeper/{id}")]
        //public async Task<IActionResult> GetZooKeeper(int id)
        //{
        //    var zooKeeper = await dbContext.ZooKeepers.FindAsync(id);
        //    if (zooKeeper == null)
        //    {
        //        return NotFound($"ZooKeeper with Id {id} not found.");
        //    }
        //    return Ok(zooKeeper);
        //}
    }
}
