namespace GamingPlatform.Api.Models.DTOs.Launch;

/// <summary>Reports whether the authenticated user may proceed to the launch window.</summary>
public sealed record EligibilityCheckResponse(bool IsEligible, string Message);
