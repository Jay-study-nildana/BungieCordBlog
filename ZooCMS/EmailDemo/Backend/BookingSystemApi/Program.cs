using BookingSystemApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddScoped<EmailService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS to allow requests from the Angular app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Angular app's origin
              .AllowAnyHeader() // Allow any headers (e.g., Content-Type)
              .AllowAnyMethod() // Allow any HTTP methods (GET, POST, PUT, etc.)
              .AllowCredentials(); // Allow cookies/authentication if needed
    });
});

var app = builder.Build();

// Use CORS policy
app.UseCors("AllowAngularApp");

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