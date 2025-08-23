using System;

namespace BungieCordBlogWebAPI.Models.Domain
{
    // The SuperPower class represents a single superpower or ability possessed by a superhero.
    // This entity is commonly used in backend web APIs to model the unique abilities that distinguish superheroes.
    // Each SuperPower is uniquely identified by a Guid, which is a globally unique identifier.
    // Using Guid as a primary key is beneficial for distributed systems and avoids collisions that can occur with integer keys.
    public class SuperPower
    {
        // Id is the primary key for this entity.
        // It uniquely identifies each SuperPower record in the database.
        // Guid is chosen for uniqueness across tables and systems.
        public Guid Id { get; set; }

        // PowerName stores the name of the superpower (e.g., "Flight", "Invisibility", "Super Strength").
        // This is a string property, which is standard for textual data.
        // It allows you to search, filter, and display superpower names in your application.
        public string PowerName { get; set; }

        // Description provides additional details about the superpower.
        // This is useful for explaining what the power does, its limitations, or its origin.
        // String is used for flexibility in describing powers.
        public string Description { get; set; }

        // SuperHeroId is a foreign key that links this superpower to a specific SuperHero.
        // This establishes a one-to-many relationship: one SuperHero can have many SuperPowers,
        // but each SuperPower belongs to one SuperHero.
        // If this property is not included, you lose the ability to associate a superpower with a superhero,
        // which is critical for queries like "show all powers for a given hero."
        // Omitting this property can lead to orphaned superpower records and data integrity issues.
        public Guid SuperHeroId { get; set; }

        // Navigation property to the SuperHero entity.
        // This allows you to access the full SuperHero object from a SuperPower instance.
        // Navigation properties are essential for Entity Framework Core to understand relationships between entities.
        // If you omit this property, you can still use the foreign key, but you lose the ability to easily
        // navigate and include related data in queries (e.g., eager loading with .Include()).
        // Not including navigation properties can make your code less readable and harder to maintain.
        //
        // Possible errors if not configured correctly:
        // - If the relationship is not set up in the DbContext, EF Core may not create the foreign key,
        //   leading to runtime errors or missing data.
        // - If you do not configure the OnDelete behavior in the DbContext, you may encounter SQL Server errors
        //   such as "conflicted with the REFERENCE constraint" when deleting records.
        //   These errors occur because the database cannot determine how to handle deletions when relationships exist.
        // - Not configuring OnDelete can also result in orphaned records or failed deletions, which compromise data integrity.
        public SuperHero SuperHero { get; set; }
    }
}