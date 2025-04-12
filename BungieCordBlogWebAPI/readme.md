# Bungie Cord Blog - Back End Web API

This is the backend project, web api.

## DB and Migrations

Update the Connection String in appsettings.json. I usually recommend you make sure that the DB is working using SQL Management Studio/Azure Data Studio. 

Next, I usually recommend you delete the folder, Migrations, and start over. 

```

Add-Migration InitialCreate -Context ApplicationDbContext
Update-Database -Context ApplicationDbContext
Add-Migration InitialCreate -Context AuthDbContext
Update-Database -Context AuthDbContext

```

Assuming all commands, work fine, double check that the tables and the data insertions were successfull.

## running on VS Code (Mac or Windows)

I have added some notes to make this project run in VS Code. This is useful if you are trying to run this project on a Mac computer where you won't have access to Visual Studio (Purple) and stuff like SQL Management Studio and SQL Server Developer Edition and SQL Server Express. Even if are not using a Mac, it will be fun to run the project on Windows as well, just using VS Code. 

Note: I still think, Windows + Visual Studio (Purple) is the best way to do .NET Programming

So, here is how you can run the current project (or any .NET Project) on VS Code with SQLite. 

1. dotnet tool install --global dotnet-ef
1. dotnet add package Microsoft.EntityFrameworkCore --version 8.0.12
1. dotnet list package
1. dotnet clean
1. dotnet build
1. dotnet ef migrations add InitialCreate --context ApplicationDbContext
1. dotnet ef database update --context ApplicationDbContext
1. dotnet ef migrations add InitialCreate --context AuthDbContext
1. dotnet ef database update --context AuthDbContext

Update the Connection String 

```
    "ConnectionString": "Data Source=BungieCordBlogDB.sqlite"
```

Also, in Program.cs, 

```
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ConnectionString")));

builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ConnectionString")));

```

Also, your AuthDBContext needs to be modified. SQLite has some limitations which the Microsoft Authentication library does not take into consideration.

```
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Check if the database provider is SQLite
            if (Database.IsSqlite())
            {
                // Apply SQLite-specific configurations
                builder.Entity<IdentityUser>(entity =>
                {
                    entity.Property(u => u.NormalizedEmail).HasMaxLength(256);
                    entity.Property(u => u.NormalizedUserName).HasMaxLength(256);
                });

                builder.Entity<IdentityRole>(entity =>
                {
                    entity.Property(r => r.NormalizedName).HasMaxLength(256);
                });
            }

            //rest of the code
```

Now, assuming all the above goes fine, you simply need to go to 

1. View
1. Command Palette
1. Search for Debug
1. Start Debugging
   1. You may have to select C# debugging at some point if it is not already selected

Also, sometimes the swagger UI will not load automatically. You might see, 'site not found' or some error. Don't panic. Simply add the URL path, https://localhost:7226/swagger/index.html, and go to Swagger UI. 

## Note

1. As of now, I have commented out all the Authorize attributes. Add them in a future version, and remove this TODO.

# book a session with me

1. [calendly](https://calendly.com/jaycodingtutor/30min)

# hire and get to know me

find ways to hire me, follow me and stay in touch with me.

1. [github](https://github.com/Jay-study-nildana)
1. [personal site](https://thechalakas.com)
1. [upwork](https://www.upwork.com/fl/vijayasimhabr)
1. [fiverr](https://www.fiverr.com/jay_codeguy)
1. [codementor](https://www.codementor.io/@vijayasimhabr)
1. [stackoverflow](https://stackoverflow.com/users/5338888/jay)
1. [Jay's Coding Channel on YouTube](https://www.youtube.com/channel/UCJJVulg4J7POMdX0veuacXw/)
1. [medium blog](https://medium.com/@vijayasimhabr)
