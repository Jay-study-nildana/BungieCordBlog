public class ComicAppearanceDto
{
    public Guid Id { get; set; }
    public string ComicTitle { get; set; }
    public int IssueNumber { get; set; }
    public DateTime ReleaseDate { get; set; }
    public Guid SuperHeroId { get; set; }
}