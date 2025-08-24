namespace BungieCordBlogWebAPI.Models.Domain
{
    public class SuperHeroImage
    {
        // Optional: loose association, not enforced by EF
        public Guid? SuperHeroId { get; set; }
        // You can add tags, descriptions, etc. if needed
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public DateTime DateCreated { get; set; }
    }
}
