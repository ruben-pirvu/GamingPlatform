using GamingPlatform.Api.Models.DTOs.Launch;

namespace GamingPlatform.Api.Modules.Launch.Abstractions;

public interface ILaunchService
{
    EligibilityCheckResponse CheckEligibility(string userId, string gameId);
}
