namespace BungieCordBlogWebAPI.Models.DTO
{
    public class UpdateSuperHeroDto
    {
        public string Name { get; set; }
        public string Alias { get; set; }
        public int Age { get; set; }
        public string Origin { get; set; }
        public DateTime FirstAppearance { get; set; }
        public bool IsActive { get; set; }
    }
}
