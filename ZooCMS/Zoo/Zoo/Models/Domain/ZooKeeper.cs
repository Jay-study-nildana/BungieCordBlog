namespace Zoo.Models.Domain
{
    public class ZooKeeper
    {
        public int Id { get; set; } // Unique identifier for the zookeeper
        public string Name { get; set; } // Full name of the zookeeper
        public int Age { get; set; } // Age of the zookeeper
        public string Role { get; set; } // Role or specialization (e.g., Mammal Keeper)
        public string ContactNumber { get; set; } // Contact number of the zookeeper
    }
}
