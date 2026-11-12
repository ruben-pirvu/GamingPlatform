namespace GamingPlatform.Api.Models.DTOs.Auth;

/// <summary>A signed access token and the authenticated user's public account details.</summary>
public sealed record LoginResponse(
    string AccessToken,
    DateTimeOffset ExpiresAt,
    AuthenticatedUserResponse User);
