using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BungieCordBlogWebAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        // 1. Open to anyone (no authentication)
        [HttpGet("open")]
        [AllowAnonymous]
        public IActionResult OpenEndpoint()
        {
            return Ok("This endpoint is open to everyone.");
        }

        // 2. Requires authentication (any authenticated user)
        [HttpGet("authenticated")]
        [Authorize]
        public IActionResult AuthenticatedEndpoint()
        {
            return Ok("This endpoint requires authentication.");
        }

        // 3. Requires Reader role
        [HttpGet("reader")]
        [Authorize(Roles = "Reader")]
        public IActionResult ReaderEndpoint()
        {
            return Ok("This endpoint is for users with the Reader role.");
        }

        // 4. Requires Writer role
        [HttpGet("writer")]
        [Authorize(Roles = "Writer")]
        public IActionResult WriterEndpoint()
        {
            return Ok("This endpoint is for users with the Writer role.");
        }
    }
}
