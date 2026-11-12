using System.IdentityModel.Tokens.Jwt;
using System.Text;
using GamingPlatform.Api.Modules.Health.Abstractions;
using GamingPlatform.Api.Modules.Health.Services;
using GamingPlatform.Api.Modules.Identity.Abstractions;
using GamingPlatform.Api.Modules.Identity.Models;
using GamingPlatform.Api.Modules.Identity.Services;
using GamingPlatform.Api.Models.DTOs.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var jwtOptions = builder.Configuration
    .GetSection(JwtOptions.SectionName)
    .Get<JwtOptions>() ?? new JwtOptions();

if (Encoding.UTF8.GetByteCount(jwtOptions.SigningKey) < 32)
{
    throw new InvalidOperationException(
        "Configure Authentication:Jwt:SigningKey with at least 32 bytes using user-secrets or an environment variable.");
}

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<IHealthService, HealthService>();
builder.Services.AddSingleton(jwtOptions);
builder.Services.AddSingleton<IUserStore, JsonUserStore>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPasswordHasher<UserRecord>, PasswordHasher<UserRecord>>();
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtOptions.Audience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
            ClockSkew = TimeSpan.FromSeconds(30),
        };
    });
builder.Services.AddAuthorization();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
