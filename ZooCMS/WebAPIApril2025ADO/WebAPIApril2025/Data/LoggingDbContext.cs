using Microsoft.EntityFrameworkCore;
using WebAPIApril2025.Models;

namespace WebAPIApril2025.Data
{
    public class LoggingDbContext : DbContext
    {
        public LoggingDbContext(DbContextOptions<LoggingDbContext> options) : base(options) { }

        public DbSet<LogEntry> Logs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LogEntry>().ToTable("Logs");
        }
    }
}
