using GamingPlatform.Api.Models.DTOs.Launch;
using GamingPlatform.Api.Modules.Content.Abstractions;
using GamingPlatform.Api.Modules.Identity.Abstractions;
using GamingPlatform.Api.Modules.Launch.Abstractions;

namespace GamingPlatform.Api.Modules.Launch.Services;

public sealed class LaunchService(
    IAuthService authService,
    IGameContentService gameContentService) : ILaunchService
{
    private const decimal MinimumWalletBalanceForLaunch = 1.00m;

    public EligibilityCheckResponse CheckEligibility(string userId, string gameId)
    {
        var user = authService.GetAuthenticatedUser(userId);
        if (user is null)
        {
            return new EligibilityCheckResponse(false, "Account could not be verified.");
        }

        if (!user.IsOfLegalAge || !user.IsEligibleToPlay)
        {
            return new EligibilityCheckResponse(false, "Age or account eligibility could not be verified.");
        }

        if (user.WalletBalance <= MinimumWalletBalanceForLaunch)
        {
            return new EligibilityCheckResponse(false, "A wallet balance greater than €1.00 is required to launch.");
        }

        var game = gameContentService.GetGameById(gameId);
        if (game is null)
        {
            return new EligibilityCheckResponse(false, "The selected game is no longer available.");
        }

        if (string.Equals(user.Country, "DE", StringComparison.OrdinalIgnoreCase) &&
            (string.Equals(game.Id, "solar-spins", StringComparison.OrdinalIgnoreCase) ||
             string.Equals(game.Id, "moonlit-mahjong", StringComparison.OrdinalIgnoreCase)))
        {
            return new EligibilityCheckResponse(false, "This game is not available in your country.");
        }

        return new EligibilityCheckResponse(true, "Game ready to load.");
    }
}
