using Microsoft.AspNetCore.Mvc;
using WebAPIApril2025.Services;

namespace WebAPIApril2025.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private readonly IQuoteService _quoteService;
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, IQuoteService quoteService)
        {
            _logger = logger;
            _quoteService = quoteService;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            _logger.LogInformation("GetWeatherForecast method called.");

            try
            {
                var forecasts = Enumerable.Range(1, 5).Select(index => new WeatherForecast
                {
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    TemperatureC = Random.Shared.Next(-20, 55),
                    Summary = Summaries[Random.Shared.Next(Summaries.Length)]
                })
                .ToArray();

                _logger.LogDebug("Generated {Count} weather forecasts.", forecasts.Length);

                foreach (var forecast in forecasts)
                {
                    _logger.LogTrace("Forecast: {Date}, {TemperatureC}°C, {Summary}",
                        forecast.Date, forecast.TemperatureC, forecast.Summary);
                }

                return forecasts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while generating weather forecasts.");
                throw;
            }
        }

        [HttpGet]
        [Route("GetRandomQuote")]
        public ActionResult<string> GetRandomQuote()
        {
            _logger.LogInformation("GetRandomQuote method called.");

            try
            {
                var quote = _quoteService.GetRandomQuote();
                _logger.LogDebug("Retrieved quote: {Quote}", quote);
                return Ok(quote);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving a random quote.");
                return StatusCode(500, "An error occurred while retrieving the quote.");
            }
        }
    }
}