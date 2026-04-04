using Microsoft.EntityFrameworkCore;
using WebAPIApril2025.Models;

//Note we are not using this Logging DB Context anywhere
//We are using Serilog with SQLite sink that connects directly to the SQLite database without needing a separate DbContext
//Please ignore this class for now

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
