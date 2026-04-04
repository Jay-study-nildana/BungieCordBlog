namespace OneToManyTheSequel.Domain
{
    public class Zoo
    {
        public int Id { get; set; }
        public string NameOfZoo { get; set; }
        public string LocationOfZoo { get; set; }

        public ICollection<Bird> Birds { get; set; } = new List<Bird>();
        public ICollection<Bear> Bears { get; set; } = new List<Bear>();
    }

    public class ZooKeeper
    {
        public int Id { get; set; }
        public string NameOfZooKeeper { get; set; } = string.Empty;

        public ICollection<Bird> Birds { get; set; } = new List<Bird>();
        public ICollection<Bear> Bears { get; set; } = new List<Bear>();

    }

    public class Bird
    {
        public int Id { get; set; }
        public string BirdName { get; set; } = string.Empty;

        public int ZooId { get; set; }
        public Zoo Zoo { get; set; } = null!;
        public int ZooKeeperId { get; set; }
        public ZooKeeper ZooKeeper { get; set; } = null!;
    }

    public class Bear
    {
        public int Id { get; set; }
        public string BearName { get; set; } = string.Empty;
        public int ZooId { get; set; }
        public Zoo Zoo { get; set; } = null!;

        public int ZooKeeperId { get; set; }
        public ZooKeeper ZooKeeper { get; set; } = null!;
    }
}
