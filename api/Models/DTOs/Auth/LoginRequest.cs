using System.ComponentModel.DataAnnotations;

namespace GamingPlatform.Api.Models.DTOs.Auth;

/// <summary>Credentials used to authenticate a user.</summary>
public sealed record LoginRequest
{
    /// <summary>The user's username.</summary>
    [Required, StringLength(100)]
    public required string Username { get; init; }

    /// <summary>The user's password.</summary>
    [Required, StringLength(128)]
    public required string Password { get; init; }
}
