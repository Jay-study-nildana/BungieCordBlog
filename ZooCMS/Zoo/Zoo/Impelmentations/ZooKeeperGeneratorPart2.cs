using Zoo.Interfaces;
using Zoo.Models.Domain;

namespace Zoo.Impelmentations
{
    public class ZooKeeperGeneratorPart2 : IZooKeeperGenerator
    {
        private readonly IRandomValueProvider _randomValueProvider;

        public ZooKeeperGeneratorPart2(IRandomValueProvider randomValueProvider)
        {
            _randomValueProvider = randomValueProvider;
        }

        public List<ZooKeeper> GenerateRandomZooKeepers(int count)
        {
            var zooKeepers = new List<ZooKeeper>();

            for (int i = 0; i < count; i++)
            {
                var zooKeeper = new ZooKeeper
                {
                    Id = i + 1,
                    Name = _randomValueProvider.GetRandomString(new[] { "John", "Jane", "Alex", "Emily", "Chris", "Taylor" }),
                    Age = _randomValueProvider.GetRandomInt(20, 60),
                    Role = _randomValueProvider.GetRandomString(new[] { "Mammal Keeper", "Bird Keeper", "Reptile Keeper", "Aquatic Keeper" }),
                    ContactNumber = $"555-{_randomValueProvider.GetRandomInt(1000, 9999)}"
                };

                zooKeepers.Add(zooKeeper);
            }

            return zooKeepers;
        }
    }
}
