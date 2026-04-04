using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;
using System.Threading.Tasks;
using WebAPIApril2025.Data;
using WebAPIApril2025.Helpers;
using WebAPIApril2025.Models;
using WebAPIApril2025.Services;

namespace UnitTests
{
    [TestFixture]
    public class HelperTests
    {
        private ApplicationDbContext _context;
        private Helper _helper;

        [SetUp]
        public void SetUp()
        {
            // Configure the in-memory database with a unique name
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: $"TestDatabase_{Guid.NewGuid()}")
                .Options;

            // Initialize the in-memory database context
            _context = new ApplicationDbContext(options);

            // Seed the database with test data
            SeedDatabase();

            // Initialize the Helper class with the in-memory context
            _helper = new Helper(_context);
        }

        private void SeedDatabase()
        {
            // Add test publishers
            _context.Publishers.Add(new Publisher { Id = 1, Name = "DC Comics" });
            _context.Publishers.Add(new Publisher { Id = 2, Name = "Marvel Comics" });

            // Add test comics
            _context.Comics.Add(new Comic { Id = 1, Title = "Detective Comics", PublisherId = 1 });
            _context.Comics.Add(new Comic { Id = 2, Title = "Avengers", PublisherId = 2 });

            // Add test characters
            _context.Characters.Add(new Character { Id = 1, Name = "Batman", ComicId = 1 });
            _context.Characters.Add(new Character { Id = 2, Name = "Iron Man", ComicId = 2 });

            // Save changes to the in-memory database
            _context.SaveChanges();
        }

        [TearDown]
        public void TearDown()
        {
            // Clear all data from the in-memory database
            _context.Characters.RemoveRange(_context.Characters);
            _context.Comics.RemoveRange(_context.Comics);
            _context.Publishers.RemoveRange(_context.Publishers);
            _context.SaveChanges();

            // Dispose of the in-memory database context
            _context.Dispose();
        }

        [Test]
        public async Task PublisherExistsAsync_ShouldReturnTrue_WhenPublisherExists()
        {
            // Act
            var result = await _helper.PublisherExistsAsync("DC Comics");

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task PublisherExistsAsync_ShouldReturnFalse_WhenPublisherDoesNotExist()
        {
            // Act
            var result = await _helper.PublisherExistsAsync("Image Comics");

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public async Task ComicExistsAsync_ShouldReturnTrue_WhenComicExists()
        {
            // Act
            var result = await _helper.ComicExistsAsync("Detective Comics");

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task ComicExistsAsync_ShouldReturnFalse_WhenComicDoesNotExist()
        {
            // Act
            var result = await _helper.ComicExistsAsync("Justice League");

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public async Task CharacterExistsAsync_ShouldReturnTrue_WhenCharacterExistsInComic()
        {
            // Act
            var result = await _helper.CharacterExistsAsync("Batman", 1);

            // Assert
            Assert.IsTrue(result);
        }

        [Test]
        public async Task CharacterExistsAsync_ShouldReturnFalse_WhenCharacterDoesNotExistInComic()
        {
            // Act
            var result = await _helper.CharacterExistsAsync("Superman", 1);

            // Assert
            Assert.IsFalse(result);
        }

        [Test]
        public void GetRandomQuote_ShouldReturnAQuote()
        {
            // Arrange
            var mockQuoteService = new Mock<IQuoteService>();
            mockQuoteService
                .Setup(service => service.GetRandomQuote())
                .Returns("Batman: \"I am vengeance. I am the night. I am Batman!\"");

            // Act
            var result = mockQuoteService.Object.GetRandomQuote();

            // Assert
            Assert.AreEqual("Batman: \"I am vengeance. I am the night. I am Batman!\"", result);

            // Verify that the method was called once
            mockQuoteService.Verify(service => service.GetRandomQuote(), Times.Once);
        }
    }
}
