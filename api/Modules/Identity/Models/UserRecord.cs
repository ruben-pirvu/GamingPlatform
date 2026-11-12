namespace GamingPlatform.Api.Modules.Identity.Models;

public sealed record UserRecord(
    string Id,
    string Username,
    string PasswordHash,
    bool IsEligibleToPlay,
    string? GovernmentId = null,
    decimal WalletBalance = 0,
    string Country = "US",
    DateOnly? DateOfBirth = null);
