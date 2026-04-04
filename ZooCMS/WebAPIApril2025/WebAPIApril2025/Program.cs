using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using WebAPIApril2025.Data;
using WebAPIApril2025.Helpers;
using WebAPIApril2025.Middlewares;
using WebAPIApril2025.Services;
using WebAPIApril2025.Validators;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<Helper>();
builder.Services.AddScoped<IQuoteService, QuoteService>();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ConnectionString")));


// Register all validators from the assembly containing CharacterDtoValidator
builder.Services.AddValidatorsFromAssemblyContaining<CharacterDtoValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<ComicDtoValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<PublisherDtoValidator>();

// Add FluentValidation's automatic model validation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

builder.Services.AddMemoryCache();

// With this line:
builder.Services.AddAutoMapper(cfg => { }, typeof(StudentProfile));


// Add services to the container.
builder.Services.AddControllers();

// Configure EF Core for SQLite logging
var dbPath = Path.Combine(AppContext.BaseDirectory, "logs.db");
//not using logging DB Context right now
//builder.Services.AddDbContext<LoggingDbContext>(options =>
//    options.UseSqlite($"Data Source={dbPath}"));

// Configure Serilog
//Serilog with SQLite sink
//It connects directly to the SQLite database without needing a separate DbContext
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.SQLite(dbPath)
    .CreateLogger();

// Add Serilog to the logging pipeline
builder.Host.UseSerilog();

var app = builder.Build();

// Test Serilog SQLite Sink
Log.Information("Application starting up. This should appear in the SQLite database.");
Log.Information("Logging to SQLite database at: {DbPath}", dbPath);

// Add the error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
