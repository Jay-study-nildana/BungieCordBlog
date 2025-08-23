using System;
using System.Collections.Generic;

namespace BungieCordBlogWebAPI.Models.Domain
{
    // The ComicAppearance class represents a single appearance of a comic in the database.
    // This class is designed to be used in a backend web API for managing superhero-related data.
    // Each ComicAppearance is uniquely identified by a Guid (globally unique identifier).
    public class ComicAppearance
    {
        // Id is the primary key for this entity.
        // Using Guid as a primary key is common in distributed systems because it guarantees uniqueness
        // across different tables and databases, and avoids collision issues that can occur with integer keys.
        public Guid Id { get; set; }

        // ComicTitle stores the name/title of the comic.
        // This is a string property, which is a standard data type for textual information.
        public string ComicTitle { get; set; }

        // IssueNumber represents the specific issue of the comic.
        // Using int is appropriate for numeric identifiers and allows for sorting and filtering by issue.
        public int IssueNumber { get; set; }

        // ReleaseDate records when the comic was published.
        // DateTime is used for date and time information, which is essential for tracking publication history.
        public DateTime ReleaseDate { get; set; }

        // SuperHeroId is a foreign key that links this comic appearance to a specific SuperHero.
        // This establishes a one-to-many relationship: one SuperHero can have many ComicAppearances.
        // If this property is not included, you lose the ability to associate a comic appearance with a superhero,
        // which is critical for queries like "show all comics for a given hero."
        public Guid SuperHeroId { get; set; }

        // Navigation property to the SuperHero entity.
        // This allows you to access the full SuperHero object from a ComicAppearance instance.
        // Navigation properties are essential for Entity Framework Core to understand relationships between entities.
        // If you omit this property, you can still use the foreign key, but you lose the ability to easily
        // navigate and include related data in queries (e.g., eager loading with .Include()).
        public SuperHero SuperHero { get; set; }

        // Navigation property for the many-to-many relationship with SidekickComicAppearance.
        // This property allows you to access all SidekickComicAppearance records that link this comic appearance
        // to various sidekicks. Each SidekickComicAppearance represents a single connection between a sidekick
        // and a comic appearance.
        //
        // Why is this important?
        // - It enables queries like "which sidekicks appeared in this comic?"
        // - It supports complex data models where sidekicks can appear in multiple comics and vice versa.
        //
        // If you omit this property, you can still create the join table, but you lose the ability to
        // easily traverse the relationship in code, which makes querying and data manipulation more difficult.
        //
        // Possible errors if not configured correctly:
        // - If the many-to-many relationship is not set up in the DbContext, EF Core may not create the join table,
        //   leading to runtime errors or missing data.
        // - If you do not configure the OnDelete behavior in the DbContext, you may encounter SQL Server errors
        //   such as "multiple cascade paths" or "conflicted with the REFERENCE constraint" when deleting records.
        //   These errors occur because the database cannot determine how to handle deletions when multiple relationships
        //   could trigger cascading deletes, potentially causing cycles or unintended data loss.
        public ICollection<SidekickComicAppearance> SidekickComicAppearances { get; set; }
    }
}