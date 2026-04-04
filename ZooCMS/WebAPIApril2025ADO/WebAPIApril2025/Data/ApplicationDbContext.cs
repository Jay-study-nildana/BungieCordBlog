using System.Collections.Generic;
using System.Reflection.Emit;
using WebAPIApril2025.Models;
using Microsoft.EntityFrameworkCore;

namespace WebAPIApril2025.Data
{
    public class ApplicationDbContext : DbContext
        {
            public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

            public virtual DbSet<Character> Characters { get; set; }
            public virtual DbSet<Comic> Comics { get; set; }
            public virtual DbSet<Publisher> Publishers { get; set; }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                modelBuilder.Entity<Comic>()
                    .HasOne(c => c.Publisher)
                    .WithMany(p => p.Comics)
                    .HasForeignKey(c => c.PublisherId);

                modelBuilder.Entity<Character>()
                    .HasOne(ch => ch.Comic)
                    .WithMany(c => c.Characters)
                    .HasForeignKey(ch => ch.ComicId);
            }
        }
}
