using Moq;
using NUnit.Framework;
using Microsoft.Extensions.Logging;
using WebAPIApril2025.Controllers;
using WebAPIApril2025.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace WebAPIApril2025.Tests.Controllers
{
    [TestFixture]
    public class WeatherForecastControllerTests
    {
        private Mock<ILogger<WeatherForecastController>> _loggerMock;
        private Mock<IQuoteService> _quoteServiceMock;
        private WeatherForecastController _controller;

        [SetUp]
        public void SetUp()
        {
            _loggerMock = new Mock<ILogger<WeatherForecastController>>();
            _quoteServiceMock = new Mock<IQuoteService>();
            _controller = new WeatherForecastController(_loggerMock.Object, _quoteServiceMock.Object);
        }

        [Test]
        public void Get_ReturnsWeatherForecasts()
        {
            // Act
            var result = _controller.Get();

            // Assert
            Assert.NotNull(result);
            Assert.AreEqual(5, result.Count());
            foreach (var forecast in result)
            {
                Assert.That(forecast.TemperatureC, Is.InRange(-20, 55));
                Assert.Contains(forecast.Summary, new[]
                {
                    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
                });
            }
        }

        [Test]
        public void GetRandomQuote_ReturnsExpectedQuote()
        {
            // Arrange
            var expectedQuote = "This is a test quote.";
            _quoteServiceMock.Setup(q => q.GetRandomQuote()).Returns(expectedQuote);

            // Act
            var result = _controller.GetRandomQuote();

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result.Result);
            var okResult = result.Result as OkObjectResult;
            Assert.AreEqual(expectedQuote, okResult.Value);
        }
    }
}
