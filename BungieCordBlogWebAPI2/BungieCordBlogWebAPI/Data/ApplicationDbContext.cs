using BungieCordBlogWebAPI.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace BungieCordBlogWebAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<BlogImage> BlogImages { get; set; }

        public DbSet<SuperHero> SuperHeroes { get; set; }
        public DbSet<SuperPower> SuperPowers { get; set; }
        public DbSet<Sidekick> Sidekicks { get; set; }
        public DbSet<ComicAppearance> ComicAppearances { get; set; }
        public DbSet<SidekickComicAppearance> SidekickComicAppearances { get; set; }

        public DbSet<SuperHeroImage> SuperHeroImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // The following configuration sets up a many-to-many relationship between Sidekick and ComicAppearance
            // using the join entity SidekickComicAppearance. This is necessary because a sidekick can appear in
            // multiple comic appearances, and a comic appearance can feature multiple sidekicks.

            modelBuilder.Entity<SidekickComicAppearance>()
                .HasKey(sca => new { sca.SidekickId, sca.ComicAppearanceId });

            // The OnDelete(DeleteBehavior.Cascade) configuration below means that if a Sidekick is deleted,
            // all related records in the SidekickComicAppearances table will also be deleted automatically.
            // This is called "cascade delete" and is useful for maintaining referential integrity.
            //
            // Why is this important?
            // - If you delete a Sidekick, you don't want orphaned records in SidekickComicAppearances that reference a non-existent Sidekick.
            // - Cascade delete ensures that the database remains clean and consistent.
            //
            // What happens if you do NOT include OnDelete(DeleteBehavior.Cascade)?
            // - If you try to delete a Sidekick that is referenced in SidekickComicAppearances, you will get a SQL error:
            //   "The DELETE statement conflicted with the REFERENCE constraint."
            // - This is because the database is trying to prevent you from breaking referential integrity.
            // - You would then have to manually delete all related SidekickComicAppearance records before deleting the Sidekick.
            //
            // Why not always use cascade delete?
            // - In some cases, cascade delete can cause unintended data loss if you accidentally delete a parent record.
            // - It is important to use cascade delete only when you are sure that deleting the parent should also delete all children.

            modelBuilder.Entity<SidekickComicAppearance>()
                .HasOne(sca => sca.Sidekick)
                .WithMany(s => s.SidekickComicAppearances)
                .HasForeignKey(sca => sca.SidekickId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade only on Sidekick

            // The OnDelete(DeleteBehavior.Restrict) configuration below means that if you try to delete a ComicAppearance
            // that is referenced by any SidekickComicAppearance, the database will prevent the deletion and throw an error.
            // This is called "restrict delete" and is useful when you want to ensure that a ComicAppearance cannot be deleted
            // if it is still referenced by any sidekick.
            //
            // Why is this important?
            // - It prevents accidental deletion of ComicAppearances that are still in use.
            // - It forces you to clean up related SidekickComicAppearance records before deleting a ComicAppearance.
            //
            // What happens if you do NOT include OnDelete(DeleteBehavior.Restrict)?
            // - By default, EF Core may use "cascade" or "no action" depending on the database provider.
            // - If both foreign keys in a join table use cascade delete, SQL Server will throw an error:
            //   "Introducing FOREIGN KEY constraint ... may cause cycles or multiple cascade paths."
            // - This is because SQL Server does not allow multiple cascade paths to prevent complex and potentially dangerous delete operations.
            //
            // Why do we use restrict here?
            // - By restricting deletes on ComicAppearance, we avoid the multiple cascade paths error.
            // - It also makes the deletion logic explicit and safe for this relationship.

            modelBuilder.Entity<SidekickComicAppearance>()
                .HasOne(sca => sca.ComicAppearance)
                .WithMany(ca => ca.SidekickComicAppearances)
                .HasForeignKey(sca => sca.ComicAppearanceId)
                .OnDelete(DeleteBehavior.Restrict); // Restrict on ComicAppearance

            // Summary:
            // - Cascade delete is used on Sidekick to automatically clean up join records when a Sidekick is deleted.
            // - Restrict delete is used on ComicAppearance to prevent deletion if it is still referenced, and to avoid SQL Server's multiple cascade paths error.
            // - Not specifying OnDelete can lead to referential integrity errors, orphaned records, or migration failures due to multiple cascade paths.
            // - Always consider the data flow and business logic when choosing delete behaviors in your relationships.
        }
    }
}