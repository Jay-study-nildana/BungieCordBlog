namespace OneToMany.Models.Domain
{
    public class Zoo
    {
        public int Id { get; set; }
        public string NameOfZoo { get; set; }
        public string LocationOfZoo { get; set; }

        public ICollection<Bird> Birds { get; set; } = new List<Bird>();
    }
}
