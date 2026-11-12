namespace GamingPlatform.Api.Models.DTOs.Games;

/// <summary>Game details available to the frontend catalog.</summary>
public sealed record GameResponse(
    string Id,
    string Title,
    string Category,
    string Description,
    string? ImageUrl);
