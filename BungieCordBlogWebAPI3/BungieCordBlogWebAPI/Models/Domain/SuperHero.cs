using System;
using System.Collections.Generic;

namespace BungieCordBlogWebAPI.Models.Domain
{
    // The SuperHero class represents a superhero character in the database.
    // This entity is central to a superhero-themed backend web API, serving as the main "parent" for related entities.
    // Each SuperHero is uniquely identified by a Guid, which is a globally unique identifier.
    // Using Guid as a primary key is beneficial for distributed systems and avoids collisions that can occur with integer keys.
    public class SuperHero
    {
        // Id is the primary key for this entity.
        // It uniquely identifies each SuperHero record in the database.
        // Guid is chosen for uniqueness across tables and systems.
        public Guid Id { get; set; }

        // Name stores the real name of the superhero.
        // This is a string property, which is standard for textual data.
        // It allows you to search, filter, and display superhero names in your application.
        public string Name { get; set; }

        // Alias stores the superhero's alternate or "hero" name.
        // This is useful for distinguishing between their public persona and secret identity.
        // String is used for flexibility in naming conventions.
        public string Alias { get; set; }

        // Age represents the age of the superhero.
        // Using int is appropriate for numeric data and allows for sorting, filtering, and validation.
        public int Age { get; set; }

        // Origin describes where the superhero comes from (e.g., city, planet, or background story).
        // String is used to allow for descriptive and varied origin stories.
        public string Origin { get; set; }

        // FirstAppearance records when the superhero first appeared (e.g., in comics or media).
        // DateTime is used for date and time information, which is essential for tracking publication history.
        public DateTime FirstAppearance { get; set; }

        // IsActive indicates whether the superhero is currently active in the universe.
        // Boolean is used for true/false status, which is useful for filtering and business logic.
        public bool IsActive { get; set; }

        // Navigation property for the one-to-many relationship with SuperPower.
        // This property allows you to access all SuperPower records associated with this superhero.
        // Each SuperHero can have multiple SuperPowers, but each SuperPower belongs to one SuperHero.
        // Why is this important?
        // - Enables queries like "what powers does this superhero have?"
        // - Supports complex data models where superheroes can have varied abilities.
        // If you omit this property, you lose the ability to easily traverse the relationship in code,
        // making querying and data manipulation more difficult.
        // Possible errors if not configured correctly:
        // - If the relationship is not set up in the DbContext, EF Core may not create the foreign key,
        //   leading to runtime errors or missing data.
        public ICollection<SuperPower> SuperPowers { get; set; }

        // Navigation property for the one-to-many relationship with Sidekick.
        // This property allows you to access all Sidekick records associated with this superhero.
        // Each SuperHero can have multiple Sidekicks, but each Sidekick belongs to one SuperHero.
        // Why is this important?
        // - Enables queries like "who are the sidekicks of this superhero?"
        // - Supports complex data models where superheroes can have teams or partners.
        // If you omit this property, you lose the ability to easily traverse the relationship in code,
        // making querying and data manipulation more difficult.
        // Possible errors if not configured correctly:
        // - If the relationship is not set up in the DbContext, EF Core may not create the foreign key,
        //   leading to runtime errors or missing data.
        public ICollection<Sidekick> Sidekicks { get; set; }

        // Navigation property for the one-to-many relationship with ComicAppearance.
        // This property allows you to access all ComicAppearance records associated with this superhero.
        // Each SuperHero can appear in multiple comics, but each ComicAppearance is linked to one SuperHero.
        // Why is this important?
        // - Enables queries like "in which comics did this superhero appear?"
        // - Supports complex data models for tracking publication history and appearances.
        // If you omit this property, you lose the ability to easily traverse the relationship in code,
        // making querying and data manipulation more difficult.
        // Possible errors if not configured correctly:
        // - If the relationship is not set up in the DbContext, EF Core may not create the foreign key,
        //   leading to runtime errors or missing data.
        public ICollection<ComicAppearance> ComicAppearances { get; set; }
    }
}