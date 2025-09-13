namespace BungieCordBlogWebAPI.Models.DTO
{
    public class AdminSummaryStatsDto
    {
        public int SuperHeroCount { get; set; }
        public int SuperPowerCount { get; set; }
        public int SidekickCount { get; set; }
        public int ComicAppearanceCount { get; set; }
        public int SidekickComicAppearanceCount { get; set; }
        public int UserCount { get; set; }
        public int RoleCount { get; set; }
        // Add more properties as needed for other entities
    }
}
