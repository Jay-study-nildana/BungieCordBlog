using Microsoft.EntityFrameworkCore;
using OneToMany.Models.Domain;

namespace OneToMany.Data
{

    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Animal> Animals { get; set; }
        public DbSet<Zoo> Zoos { get; set; }
        public DbSet<Bird> Birds { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Bird>()
                .HasOne(ameeshapatel => ameeshapatel.Zoo)
                .WithMany(sreeleela => sreeleela.Birds)
                .HasForeignKey(samantha => samantha.ZooId);

        }
    }
}
