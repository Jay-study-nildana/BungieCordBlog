using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using OneToMany.Data;
using OneToMany.Models.Domain;
using OneToMany.Models.DTO;

namespace OneToMany.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PracticeController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public PracticeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetZoos")]
        public async Task<ActionResult<IEnumerable<Zoo>>> GetZoos()
        {
            return await _context.Zoos.ToListAsync();
        }

        [HttpPost]
        [Route("CreateZoo")]
        public async Task<ActionResult<Zoo>> CreateZoo(ZooDTO zooDTO)
        {
            var ZooObjectForDB = new Zoo();

            ZooObjectForDB.LocationOfZoo = zooDTO.LocationOfZoo;
            ZooObjectForDB.NameOfZoo = zooDTO.NameOfZoo;
            
            _context.Zoos.Add(ZooObjectForDB);
            await _context.SaveChangesAsync();

            return Ok(ZooObjectForDB);
        }


        [HttpGet]
        [Route("GetBirds")]
        public async Task<ActionResult<IEnumerable<Bird>>> GetBirds()
        {
            var listOfBirds = await _context.Birds.ToListAsync();
            return listOfBirds;
        }

        [HttpPost]
        [Route("CreateBird")]
        public async Task<ActionResult<Bird>> CreateBird(BirdDTO bird)
        {
            var tempZoo = await _context.Zoos.FirstOrDefaultAsync(ameeshapatel => ameeshapatel.Id == bird.ZooId);

            if(tempZoo == null)
            {
                var errormessage = "This Zoo with the ID : " + bird.ZooId + "is not a real zoo. Please add the zoo first, before adding the bird to the zoo";
                return BadRequest(errormessage);
            }

            var birdObjectForDB = new Bird();
            birdObjectForDB.BirdName = bird.BirdName;
            birdObjectForDB.ZooId = bird.ZooId;


            _context.Birds.Add(birdObjectForDB);
            await _context.SaveChangesAsync();

            return Ok(bird);


        }


    }
}
