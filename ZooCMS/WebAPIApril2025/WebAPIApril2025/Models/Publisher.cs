namespace WebAPIApril2025.Models
{
    public class Publisher
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ICollection<Comic> Comics { get; set; } = new List<Comic>();
    }
}
