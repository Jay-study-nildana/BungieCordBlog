namespace OneToMany.Models.Domain
{
    public class Bird
    {
        public int Id { get; set; }
        public string BirdName { get; set; } = string.Empty;

        public int ZooId { get; set; }
        public Zoo Zoo { get; set; } = null!;
    }

}