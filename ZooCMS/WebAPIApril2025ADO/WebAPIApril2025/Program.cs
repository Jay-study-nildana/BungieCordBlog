using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Serilog;
using WebAPIApril2025.Data;
using WebAPIApril2025.Helpers;
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

//TODO : fix obsolete warning
builder.Services.AddControllers()
    .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<CharacterDtoValidator>());
builder.Services.AddControllers()
    .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<ComicDtoValidator>());
builder.Services.AddControllers()
    .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<PublisherDtoValidator>());

builder.Services.AddMemoryCache();

// Add services to the container.
builder.Services.AddControllers();

// Configure EF Core for SQLite logging
var dbPath = Path.Combine(AppContext.BaseDirectory, "logs.db");
builder.Services.AddDbContext<LoggingDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()
    .WriteTo.SQLite(dbPath)
    .CreateLogger();

// Add Serilog to the logging pipeline
builder.Host.UseSerilog();

var app = builder.Build();

// Test Serilog SQLite Sink
Log.Information("Application starting up. This should appear in the SQLite database.");
Log.Information("Logging to SQLite database at: {DbPath}", dbPath);

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