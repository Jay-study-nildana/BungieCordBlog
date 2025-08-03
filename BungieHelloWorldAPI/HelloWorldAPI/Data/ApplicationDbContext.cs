using HelloWorldAPI.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace HelloWorldAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<BlogPost> BlogPosts { get; set; }
    }
}
