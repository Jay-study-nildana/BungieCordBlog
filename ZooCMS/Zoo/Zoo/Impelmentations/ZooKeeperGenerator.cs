using Zoo.Interfaces;
using Zoo.Models.Domain;

namespace Zoo.Impelmentations
{
    public class ZooKeeperGenerator : IZooKeeperGenerator
    {
        private static readonly string[] Names = { "John", "Jane", "Alex", "Emily", "Chris", "Taylor" };
        private static readonly string[] Roles = { "Mammal Keeper", "Bird Keeper", "Reptile Keeper", "Aquatic Keeper" };

        public List<ZooKeeper> GenerateRandomZooKeepers(int count)
        {
            var random = new Random();
            var zooKeepers = new List<ZooKeeper>();

            for (int i = 0; i < count; i++)
            {
                var zooKeeper = new ZooKeeper
                {
                    Id = i + 1,
                    Name = Names[random.Next(Names.Length)],
                    Age = random.Next(20, 60),
                    Role = Roles[random.Next(Roles.Length)],
                    ContactNumber = $"555-{random.Next(1000, 9999)}"
                };

                zooKeepers.Add(zooKeeper);
            }

            return zooKeepers;
        }
    }
}
