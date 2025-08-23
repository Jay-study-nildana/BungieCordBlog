using System;

namespace BungieCordBlogWebAPI.Models.Domain
{
    // The SidekickComicAppearance class is a join entity that represents the many-to-many relationship
    // between Sidekick and ComicAppearance. In relational database design, many-to-many relationships
    // cannot be represented directly; instead, a join table (or join entity) is used to connect the two entities.
    //
    // Why is this class necessary?
    // - A single sidekick can appear in multiple comic appearances.
    // - A single comic appearance can feature multiple sidekicks.
    // - This class allows you to efficiently model and query these relationships in your backend web API.
    // - It also provides a place to add additional properties in the future (e.g., role in the comic, appearance order).
    //
    // In Entity Framework Core, this join entity is mapped to a table with two foreign keys:
    // - SidekickId: references the Sidekick entity.
    // - ComicAppearanceId: references the ComicAppearance entity.
    // The combination of these two keys forms the composite primary key for the table.
    //
    // If you do not include this class and its configuration in your DbContext:
    // - EF Core will not create the join table, and you will not be able to represent many-to-many relationships.
    // - You will lose the ability to query which sidekicks appeared in which comics and vice versa.
    // - Your data model will be less flexible and may not support future requirements.
    //
    // Possible errors if not configured correctly:
    // - If you do not set up the composite key, EF Core may throw errors about missing primary keys.
    // - If you do not configure the OnDelete behavior in your DbContext, you may encounter SQL Server errors
    //   such as "multiple cascade paths" or "conflicted with the REFERENCE constraint" when deleting records.
    //   These errors occur because the database cannot determine how to handle deletions when multiple relationships
    //   could trigger cascading deletes, potentially causing cycles or unintended data loss.
    // - Not configuring OnDelete can also result in orphaned records or failed deletions, which compromise data integrity.
    //
    // This class is a critical part of your data model for representing complex relationships in a superhero universe.

    public class SidekickComicAppearance
    {
        // SidekickId is a foreign key that references the Sidekick entity.
        // It is part of the composite primary key for this join table.
        // This property allows you to associate a specific sidekick with a comic appearance.
        // If this property is not included, you cannot link sidekicks to comic appearances.
        public Guid SidekickId { get; set; }

        // Navigation property to the Sidekick entity.
        // This allows you to access the full Sidekick object from a SidekickComicAppearance instance.
        // Navigation properties are essential for Entity Framework Core to understand relationships between entities.
        // If you omit this property, you can still use the foreign key, but you lose the ability to easily
        // navigate and include related data in queries (e.g., eager loading with .Include()).
        public Sidekick Sidekick { get; set; }

        // ComicAppearanceId is a foreign key that references the ComicAppearance entity.
        // It is part of the composite primary key for this join table.
        // This property allows you to associate a specific comic appearance with a sidekick.
        // If this property is not included, you cannot link comic appearances to sidekicks.
        public Guid ComicAppearanceId { get; set; }

        // Navigation property to the ComicAppearance entity.
        // This allows you to access the full ComicAppearance object from a SidekickComicAppearance instance.
        // Navigation properties are essential for Entity Framework Core to understand relationships between entities.
        // If you omit this property, you can still use the foreign key, but you lose the ability to easily
        // navigate and include related data in queries (e.g., eager loading with .Include()).
        public ComicAppearance ComicAppearance { get; set; }
    }
}