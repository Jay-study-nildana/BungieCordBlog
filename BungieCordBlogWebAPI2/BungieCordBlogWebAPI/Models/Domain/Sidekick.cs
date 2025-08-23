using System;
using System.Collections.Generic;

namespace BungieCordBlogWebAPI.Models.Domain
{
    // The Sidekick class represents a supporting character who assists a SuperHero.
    // This entity is commonly used in backend web APIs to model relationships and data about superhero universes.
    // Each Sidekick is uniquely identified by a Guid, which is a globally unique identifier.
    // Using Guid as a primary key is beneficial for distributed systems and avoids collisions that can occur with integer keys.
    public class Sidekick
    {
        // Id is the primary key for this entity.
        // It uniquely identifies each Sidekick record in the database.
        // Guid is chosen for uniqueness across tables and systems.
        public Guid Id { get; set; }

        // Name stores the name of the sidekick.
        // This is a string property, which is standard for textual data.
        // It allows you to search, filter, and display sidekick names in your application.
        public string Name { get; set; }

        // Age represents the age of the sidekick.
        // Using int is appropriate for numeric data and allows for sorting, filtering, and validation.
        public int Age { get; set; }

        // SuperHeroId is a foreign key that links this sidekick to a specific SuperHero.
        // This establishes a one-to-many relationship: one SuperHero can have many Sidekicks.
        // If this property is not included, you lose the ability to associate a sidekick with a superhero,
        // which is critical for queries like "show all sidekicks for a given hero."
        // Omitting this property can lead to orphaned sidekick records and data integrity issues.
        public Guid SuperHeroId { get; set; }

        // Navigation property to the SuperHero entity.
        // This allows you to access the full SuperHero object from a Sidekick instance.
        // Navigation properties are essential for Entity Framework Core to understand relationships between entities.
        // If you omit this property, you can still use the foreign key, but you lose the ability to easily
        // navigate and include related data in queries (e.g., eager loading with .Include()).
        // Not including navigation properties can make your code less readable and harder to maintain.
        public SuperHero SuperHero { get; set; }

        // Navigation property for the many-to-many relationship with ComicAppearance via SidekickComicAppearance.
        // This property allows you to access all SidekickComicAppearance records that link this sidekick
        // to various comic appearances. Each SidekickComicAppearance represents a single connection between a sidekick
        // and a comic appearance.
        //
        // Why is this important?
        // - It enables queries like "which comics did this sidekick appear in?"
        // - It supports complex data models where sidekicks can appear in multiple comics and comics can feature multiple sidekicks.
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
        // - Not configuring OnDelete can also result in orphaned records or failed deletions, which compromise data integrity.
        public ICollection<SidekickComicAppearance> SidekickComicAppearances { get; set; }
    }
}