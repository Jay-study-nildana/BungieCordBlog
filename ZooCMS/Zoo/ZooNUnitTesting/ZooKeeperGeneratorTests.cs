using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Zoo.Impelmentations;
using Zoo.Models.Domain;

namespace ZooNUnitTesting
{
    [TestFixture]
    public class ZooKeeperGeneratorTests
    {
        private ZooKeeperGenerator _zooKeeperGenerator;

        [SetUp]
        public void Setup()
        {
            _zooKeeperGenerator = new ZooKeeperGenerator();
        }

        [Test]
        public void GenerateRandomZooKeepers_ShouldReturnCorrectCount()
        {
            // Arrange
            int count = 5;

            // Act
            List<ZooKeeper> result = _zooKeeperGenerator.GenerateRandomZooKeepers(count);

            // Assert
            Assert.AreEqual(count, result.Count, "The number of generated ZooKeepers should match the requested count.");
        }

        [Test]
        public void GenerateRandomZooKeepers_ShouldGenerateUniqueIds()
        {
            // Arrange
            int count = 10;

            // Act
            List<ZooKeeper> result = _zooKeeperGenerator.GenerateRandomZooKeepers(count);

            // Assert
            var uniqueIds = new HashSet<int>();
            foreach (var zooKeeper in result)
            {
                Assert.IsTrue(uniqueIds.Add(zooKeeper.Id), $"Duplicate Id found: {zooKeeper.Id}");
            }
        }

        [Test]
        public void GenerateRandomZooKeepers_ShouldGenerateValidZooKeepers()
        {
            // Arrange
            int count = 3;

            // Act
            List<ZooKeeper> result = _zooKeeperGenerator.GenerateRandomZooKeepers(count);

            // Assert
            foreach (var zooKeeper in result)
            {
                Assert.IsNotNull(zooKeeper.Name, "ZooKeeper Name should not be null.");
                Assert.IsNotNull(zooKeeper.Role, "ZooKeeper Role should not be null.");
                Assert.IsTrue(zooKeeper.Age >= 20 && zooKeeper.Age <= 60, "ZooKeeper Age should be between 20 and 60.");
                Assert.IsTrue(zooKeeper.ContactNumber.StartsWith("555-"), "ZooKeeper ContactNumber should start with '555-'.");
            }
        }
    }
}
