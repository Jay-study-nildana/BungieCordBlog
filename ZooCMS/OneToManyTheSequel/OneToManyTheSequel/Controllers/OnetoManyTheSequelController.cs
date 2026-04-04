using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OneToManyTheSequel.Domain;
using OneToManyTheSequel.DTO;

namespace OneToManyTheSequel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OnetoManyTheSequelController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public OnetoManyTheSequelController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("zoos")]
        public IActionResult GetAllZoos()
        {
            var zoos = _context.Zoos.ToList();
            return Ok(zoos);
        }

        [HttpPost]
        [Route("zoos")]
        public IActionResult CreateZoo([FromBody] ZooDto zooDto)
        {
            //if (zoo == null)
            //    return BadRequest();

            //_context.Zoos.Add(zoo);
            //_context.SaveChanges();
            //return CreatedAtAction(nameof(GetAllZoos), new { id = zoo.Id }, zoo);

            if (zooDto == null)
                return BadRequest();

            // Map the DTO to the domain model
            var zoo = new Zoo
            {
                NameOfZoo = zooDto.NameOfZoo,
                LocationOfZoo = zooDto.LocationOfZoo
            };

            _context.Zoos.Add(zoo);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetAllZoos), new { id = zoo.Id }, zoo);
        }

        // Endpoint to get all Zoos with their Birds and Bears
        [HttpGet("WithAnimals")]
        public IActionResult GetZoosWithAnimals()
        {
            var zoos = _context.Zoos
                .Include(z => z.Birds)
                .Include(z => z.Bears)
                .ToList();

            return Ok(zoos);
        }

        [HttpGet]
        [Route("zookeepers")]
        public IActionResult GetAllZooKeepers()
        {
            var zooKeepers = _context.ZooKeepers.ToList();
            return Ok(zooKeepers);
        }

        [HttpPost]
        [Route("zookeepers")]
        public IActionResult CreateZooKeeper([FromBody] ZooKeeperDto zooKeeperDto)
        {
            //if (zooKeeper == null)
            //    return BadRequest();

            //_context.ZooKeepers.Add(zooKeeper);
            //_context.SaveChanges();
            //return CreatedAtAction(nameof(GetAllZooKeepers), new { id = zooKeeper.Id }, zooKeeper);

            if (zooKeeperDto == null)
                return BadRequest();

            // Map the DTO to the domain model
            var zooKeeper = new ZooKeeper
            {
                NameOfZooKeeper = zooKeeperDto.NameOfZooKeeper
            };

            _context.ZooKeepers.Add(zooKeeper);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetAllZooKeepers), new { id = zooKeeper.Id }, zooKeeper);
        }

        [HttpGet("zookeepers/WithAnimals")]
        public IActionResult GetZooKeepersWithAnimals()
        {
            var zooKeepers = _context.ZooKeepers
                .Include(zk => zk.Birds)
                .Include(zk => zk.Bears)
                .ToList();

            return Ok(zooKeepers);
        }

        [HttpGet]
        [Route("birds")]
        public IActionResult GetAllBirds()
        {
            var birds = _context.Birds.ToList();
            return Ok(birds);
        }

        [HttpPost]
        [Route("birds")]
        public IActionResult CreateBird([FromBody] BirdDto birdDto)
        {
            //if (bird == null)
            //    return BadRequest();

            //_context.Birds.Add(bird);
            //_context.SaveChanges();
            //return CreatedAtAction(nameof(GetAllBirds), new { id = bird.Id }, bird);

            if (birdDto == null)
                return BadRequest();

            // Map the DTO to the domain model
            var bird = new Bird
            {
                BirdName = birdDto.BirdName,
                ZooId = birdDto.ZooId,
                ZooKeeperId = birdDto.ZooKeeperId
            };

            _context.Birds.Add(bird);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetAllBirds), new { id = bird.Id }, bird);
        }

        [HttpGet]
        [Route("bears")]
        public IActionResult GetAllBears()
        {
            var bears = _context.Bears.ToList();
            return Ok(bears);
        }

        [HttpPost]
        [Route("bears")]
        public IActionResult CreateBear([FromBody] BearDto bearDto)
        {
            //if (bear == null)
            //    return BadRequest();

            //_context.Bears.Add(bear);
            //_context.SaveChanges();
            //return CreatedAtAction(nameof(GetAllBears), new { id = bear.Id }, bear);

            if (bearDto == null)
                return BadRequest();

            // Map the DTO to the domain model
            var bear = new Bear
            {
                BearName = bearDto.BearName,
                ZooId = bearDto.ZooId,
                ZooKeeperId = bearDto.ZooKeeperId
            };

            _context.Bears.Add(bear);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetAllBears), new { id = bear.Id }, bear);
        }

        #region discussion about circular references

  //      You might get the following error if you try and use data objects
        
  //      An unhandled exception has occurred while executing the request.
  //System.Text.Json.JsonException: A possible object cycle was detected.This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles.Path: $.Zoo.Birds.Zoo.Birds.Zoo.Birds.Zoo.Birds.Zoo.Birds.Zoo.Birds.Zoo.Birds.Zoo.Birds.Zoo.Birds.Zoo.Birds.Zoo.Id

  //      To fix this, you can use the following code in your Startup.cs file:
  //      services.AddControllers()
  //          .AddJsonOptions(options =>
  //          {
  //              options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
  //  options.JsonSerializerOptions.MaxDepth = 64; // Increase the max depth if needed
  //  });
  //      This will allow for circular references in your data objects.
  //      You can also use DTOs to avoid circular references.This is a good practice as it allows you to control what data is sent to the client and avoid exposing unnecessary data.

  //      You can create DTOs for your data objects and use them in your API endpoints instead of the data objects themselves.

  //      This will help you avoid circular references and make your API more efficient.

    #endregion

        [HttpPost]
        [Route("zoos/add-with-animals")]
        public IActionResult AddZooWithAnimals()
        {
            // Create the Zoo
            var zoo = new Zoo
            {
                NameOfZoo = "Safari Park",
                LocationOfZoo = "California"
            };

            _context.Zoos.Add(zoo);
            _context.SaveChanges();

            // Create ZooKeepers
            var zooKeeper1 = new ZooKeeper
            {
                NameOfZooKeeper = "John Doe"
            };

            var zooKeeper2 = new ZooKeeper
            {
                NameOfZooKeeper = "Jane Smith"
            };

            _context.ZooKeepers.AddRange(zooKeeper1, zooKeeper2);
            _context.SaveChanges();

            // Create Birds
            var birds = new List<Bird>
    {
        new Bird { BirdName = "Parrot", ZooId = zoo.Id, ZooKeeperId = zooKeeper1.Id },
        new Bird { BirdName = "Eagle", ZooId = zoo.Id, ZooKeeperId = zooKeeper2.Id },
        new Bird { BirdName = "Sparrow", ZooId = zoo.Id, ZooKeeperId = zooKeeper1.Id }
    };

            _context.Birds.AddRange(birds);
            _context.SaveChanges();

            // Create Bears
            var bears = new List<Bear>
    {
        new Bear { BearName = "Grizzly", ZooId = zoo.Id, ZooKeeperId = zooKeeper1.Id },
        new Bear { BearName = "Polar Bear", ZooId = zoo.Id, ZooKeeperId = zooKeeper2.Id },
        new Bear { BearName = "Black Bear", ZooId = zoo.Id, ZooKeeperId = zooKeeper1.Id }
    };

            _context.Bears.AddRange(bears);
            _context.SaveChanges();

            // Map to DTOs
            var zooDto = new ZooDto
            {
                NameOfZoo = zoo.NameOfZoo,
                LocationOfZoo = zoo.LocationOfZoo
            };

            var zooKeeperDtos = new List<ZooKeeperDto>
    {
        new ZooKeeperDto { NameOfZooKeeper = zooKeeper1.NameOfZooKeeper },
        new ZooKeeperDto { NameOfZooKeeper = zooKeeper2.NameOfZooKeeper }
    };

            var birdDtos = birds.Select(b => new BirdDto
            {
                BirdName = b.BirdName,
                ZooId = b.ZooId,
                ZooKeeperId = b.ZooKeeperId
            }).ToList();

            var bearDtos = bears.Select(b => new BearDto
            {
                BearName = b.BearName,
                ZooId = b.ZooId,
                ZooKeeperId = b.ZooKeeperId
            }).ToList();

            // Return the created data as DTOs
            return CreatedAtAction(nameof(GetAllZoos), new { id = zoo.Id }, new
            {
                Zoo = zooDto,
                ZooKeepers = zooKeeperDtos,
                Birds = birdDtos,
                Bears = bearDtos
            });
        }

    }
}
