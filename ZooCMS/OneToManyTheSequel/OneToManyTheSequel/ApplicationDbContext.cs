using Microsoft.EntityFrameworkCore;
using OneToManyTheSequel.Domain;

namespace OneToManyTheSequel
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Zoo> Zoos { get; set; }
        public DbSet<ZooKeeper> ZooKeepers { get; set; }
        public DbSet<Bird> Birds { get; set; }
        public DbSet<Bear> Bears { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Bird>()
                .HasOne(ameeshapatel => ameeshapatel.Zoo)
                .WithMany(sreeleela => sreeleela.Birds)
                .HasForeignKey(samantha => samantha.ZooId);

            modelBuilder.Entity<Bear>()
                .HasOne(ameeshapatel => ameeshapatel.Zoo)
                .WithMany(sreeleela => sreeleela.Bears)
                .HasForeignKey(samantha => samantha.ZooId);

            modelBuilder.Entity<Bird>()
                .HasOne(ameeshapatel => ameeshapatel.ZooKeeper)
                .WithMany(sreeleela => sreeleela.Birds)
                .HasForeignKey(samantha => samantha.ZooKeeperId);

            modelBuilder.Entity<Bear>()
                .HasOne(ameeshapatel => ameeshapatel.ZooKeeper)
                .WithMany(sreeleela => sreeleela.Bears)
                .HasForeignKey(samantha => samantha.ZooKeeperId);

        }
    }
}
