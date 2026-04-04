using Microsoft.EntityFrameworkCore;
using Zoo.Models.Domain;

namespace Zoo.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        //public DbSet<BlogPost> BlogPosts { get; set; }
        //public DbSet<Category> Categories { get; set; }
        //public DbSet<BlogImage> BlogImages { get; set; }

        public DbSet<Animal> Animals { get; set; }
        public DbSet<ZooKeeper> ZooKeepers { get; set; }
    }
}
