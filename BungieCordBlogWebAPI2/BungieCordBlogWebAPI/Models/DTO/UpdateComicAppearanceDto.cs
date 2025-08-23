public class UpdateComicAppearanceDto
{
    public string ComicTitle { get; set; }
    public int IssueNumber { get; set; }
    public DateTime ReleaseDate { get; set; }
    public Guid SuperHeroId { get; set; }
}