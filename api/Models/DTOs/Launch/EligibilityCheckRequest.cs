using System.ComponentModel.DataAnnotations;

namespace GamingPlatform.Api.Models.DTOs.Launch;

/// <summary>Identifies the game to check before opening its launch window.</summary>
public sealed record EligibilityCheckRequest
{
    [Required, StringLength(100)]
    public required string GameId { get; init; }
}
