namespace WebAPIApril2025.Models
{
    public class Comic
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public int PublisherId { get; set; }
        public Publisher Publisher { get; set; } = null!;
        public ICollection<Character> Characters { get; set; } = new List<Character>();
    }
}
