namespace WebAPIApril2025.Models
{
    public class Character
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ComicId { get; set; }
        public Comic Comic { get; set; } = null!;
    }
}
