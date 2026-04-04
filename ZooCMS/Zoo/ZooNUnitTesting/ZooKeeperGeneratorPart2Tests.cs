using Moq;
using NUnit.Framework;
using Zoo.Impelmentations;
using Zoo.Interfaces;
using Zoo.Models.Domain;
using System.Collections.Generic;

namespace ZooNUnitTesting
{
    [TestFixture]
    public class ZooKeeperGeneratorPart2Tests
    {
        private Mock<IRandomValueProvider> _mockRandomValueProvider;
        private ZooKeeperGeneratorPart2 _zooKeeperGeneratorPart2;

        [SetUp]
        public void Setup()
        {
            _mockRandomValueProvider = new Mock<IRandomValueProvider>();
            _zooKeeperGeneratorPart2 = new ZooKeeperGeneratorPart2(_mockRandomValueProvider.Object);
        }

        [Test]
        public void GenerateRandomZooKeepers_ShouldReturnCorrectCount()
        {
            // Arrange
            int count = 3;
            _mockRandomValueProvider.Setup(r => r.GetRandomInt(It.IsAny<int>(), It.IsAny<int>())).Returns(25);
            _mockRandomValueProvider.Setup(r => r.GetRandomString(It.IsAny<string[]>())).Returns("John");

            // Act
            List<ZooKeeper> result = _zooKeeperGeneratorPart2.GenerateRandomZooKeepers(count);

            // Assert
            Assert.AreEqual(count, result.Count, "The number of generated ZooKeepers should match the requested count.");
        }

        [Test]
        public void GenerateRandomZooKeepers_ShouldUseMockedValues()
        {
            // Arrange
            _mockRandomValueProvider.Setup(r => r.GetRandomInt(It.IsAny<int>(), It.IsAny<int>())).Returns(30);
            _mockRandomValueProvider.Setup(r => r.GetRandomString(It.IsAny<string[]>())).Returns("MockedName");

            // Act
            List<ZooKeeper> result = _zooKeeperGeneratorPart2.GenerateRandomZooKeepers(1);

            // Assert
            Assert.AreEqual(30, result[0].Age, "The Age should match the mocked value.");
            Assert.AreEqual("MockedName", result[0].Name, "The Name should match the mocked value.");
        }
    }
}
