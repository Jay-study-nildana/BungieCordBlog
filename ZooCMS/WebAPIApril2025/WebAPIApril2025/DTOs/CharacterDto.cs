namespace WebAPIApril2025.DTOs
{
    public class CharacterDto
    {

        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ComicId { get; set; } // Add this property
        public string ComicTitle { get; set; } = string.Empty;
    }
}
