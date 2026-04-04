using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using Zoo.Controllers;
using Zoo.Data;
using Zoo.Models.Domain;

namespace ZooNUnitTesting
{
    public class ZooKeeperControllerTests
    {
        private ApplicationDbContext _dbContext;
        private ZooKeeperController _controller;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _dbContext = new ApplicationDbContext(options);
            _controller = new ZooKeeperController(_dbContext);
        }

        [TearDown]
        public void TearDown()
        {
            _dbContext.Dispose();
        }

        [Test]
        public async Task GetZookeepers_ShouldReturnListOfZooKeepers()
        {
            // Arrange
            _dbContext.ZooKeepers.Add(new ZooKeeper
            {
                Id = 1,
                Name = "John",
                Age = 30,
                Role = "Mammal Keeper",
                ContactNumber = "555-1234"
            });
            _dbContext.SaveChanges();

            // Act
            var result = await _controller.GetZookeepers();

            // Assert
            Assert.IsInstanceOf<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var returnedZooKeepers = okResult.Value as List<ZooKeeper>;
            Assert.AreEqual(1, returnedZooKeepers.Count);
            Assert.AreEqual("John", returnedZooKeepers[0].Name);
        }
    }
}
