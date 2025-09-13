using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BungieCordBlogWebAPI.Data
{
    /// <summary>
    /// AuthDbContext is the Entity Framework Core context for authentication and authorization.
    /// It inherits from IdentityDbContext, which provides all the tables and logic needed for ASP.NET Core Identity.
    /// </summary>
    public class AuthDbContext : IdentityDbContext
    {
        /// <summary>
        /// Constructor for AuthDbContext. Passes options to the base IdentityDbContext.
        /// </summary>
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {
        }

        /// <summary>
        /// Configures the model and seeds initial data for roles and the admin user.
        /// </summary>
        /// <param name="builder">The ModelBuilder used to configure entity mappings and seed data.</param>
        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Always call the base method first to ensure Identity's default configuration is applied.
            base.OnModelCreating(builder);

            // Define unique IDs for each role. These are GUIDs as strings.
            var readerRoleId = "38e75b6c-b8ec-4951-c481-946a2f8e8642";
            var writerRoleId = "a850f27d-35b2-5335-b8cf-2cc11c8d7904";
            var adminRoleId = "c1a1e2d3-4b5c-6d7e-8f90-123456789abc"; // New Admin role ID

            // Create a list of IdentityRole objects to seed into the database.
            // Each role has an Id, Name, NormalizedName (always uppercase), and ConcurrencyStamp.
            var roles = new List<IdentityRole>
            {
                new IdentityRole()
                {
                    Id = readerRoleId,
                    Name = "Reader",
                    NormalizedName = "READER",
                    ConcurrencyStamp = readerRoleId
                },
                new IdentityRole()
                {
                    Id = writerRoleId,
                    Name = "Writer",
                    NormalizedName = "WRITER",
                    ConcurrencyStamp = writerRoleId
                },
                new IdentityRole()
                {
                    Id = adminRoleId,
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = adminRoleId
                }
            };

            // Seed the roles into the database.
            builder.Entity<IdentityRole>().HasData(roles);

            // Define a unique ID for the admin user.
            var adminUserId = "f3d378fd-e54d-5f4c-9219-b2b2f92a017e";

            // Create the admin user object.
            // Note: The password is hashed using ASP.NET Core Identity's PasswordHasher.
            var admin = new IdentityUser()
            {
                Id = adminUserId,
                UserName = "admin@BungieCordBlog.com",
                Email = "admin@BungieCordBlog.com",
                NormalizedEmail = "ADMIN@BUNGIECORDBLOG.COM",
                NormalizedUserName = "ADMIN@BUNGIECORDBLOG.COM"
            };

            // Hash the password for the admin user.
            admin.PasswordHash = new PasswordHasher<IdentityUser>().HashPassword(admin, "Password@6969");

            // Seed the admin user into the database.
            builder.Entity<IdentityUser>().HasData(admin);

            // Assign all three roles (Reader, Writer, Admin) to the admin user.
            // This is done by creating IdentityUserRole objects that link the user to each role.
            var adminRoles = new List<IdentityUserRole<string>>()
            {
                new IdentityUserRole<string>()
                {
                    UserId = adminUserId,
                    RoleId = readerRoleId
                },
                new IdentityUserRole<string>()
                {
                    UserId = adminUserId,
                    RoleId = writerRoleId
                },
                new IdentityUserRole<string>()
                {
                    UserId = adminUserId,
                    RoleId = adminRoleId // Assign the new Admin role to the admin user
                }
            };

            // Seed the user-role relationships into the database.
            builder.Entity<IdentityUserRole<string>>().HasData(adminRoles);

            // Summary for students:
            // - This method seeds three roles: Reader, Writer, and Admin.
            // - It creates one admin user with a known email and password.
            // - The admin user is assigned all three roles.
            // - This setup is useful for initial testing and development.
            // - In production, always use strong, unique passwords and consider using environment variables or secrets for sensitive data.
        }
    }
}