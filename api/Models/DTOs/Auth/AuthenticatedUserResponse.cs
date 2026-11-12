namespace GamingPlatform.Api.Models.DTOs.Auth;

/// <summary>Public account information for an authenticated user.</summary>
public sealed record AuthenticatedUserResponse(
    string Id,
    string Username,
    bool IsEligibleToPlay,
    bool IsOfLegalAge,
    decimal WalletBalance,
    string Country);
