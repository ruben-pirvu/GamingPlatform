namespace GamingPlatform.Api.Modules.Identity.Models;

public sealed record UserRecord(
    string Id,
    string Username,
    string PasswordHash,
    bool IsEligibleToPlay);
