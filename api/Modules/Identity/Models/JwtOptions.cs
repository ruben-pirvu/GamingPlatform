namespace GamingPlatform.Api.Modules.Identity.Models;

public sealed class JwtOptions
{
    public const string SectionName = "Authentication:Jwt";

    public string SigningKey { get; init; } = string.Empty;

    public string Issuer { get; init; } = "GamingPlatform.Api";

    public string Audience { get; init; } = "GamingPlatform.Angular";

    public int LifetimeMinutes { get; init; } = 60;
}
