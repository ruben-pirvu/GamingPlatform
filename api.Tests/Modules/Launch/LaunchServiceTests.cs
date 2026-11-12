using GamingPlatform.Api.Models.DTOs.Auth;
using GamingPlatform.Api.Models.DTOs.Games;
using GamingPlatform.Api.Modules.Content.Abstractions;
using GamingPlatform.Api.Modules.Identity.Abstractions;
using GamingPlatform.Api.Modules.Launch.Services;
using Moq;

namespace GamingPlatform.Api.Tests.Modules.Launch;

public class LaunchServiceTests
{
    [Fact]
    public void CheckEligibility_AllowsEligibleAdultForAvailableGame()
    {
        var authService = new Mock<IAuthService>();
        authService
            .Setup(service => service.GetAuthenticatedUser("player-1"))
            .Returns(new AuthenticatedUserResponse("player-1", "demo", true, true, 125.50m, "US"));
        var contentService = new Mock<IGameContentService>();
        contentService
            .Setup(service => service.GetGameById("solar-spins"))
            .Returns(new GameResponse("solar-spins", "Solar Spins", "Slots", "Demo game.", null));
        var service = new LaunchService(authService.Object, contentService.Object);

        var response = service.CheckEligibility("player-1", "solar-spins");

        Assert.True(response.IsEligible);
    }

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    public void CheckEligibility_DeniesUsersWhoFailEligibility(bool isEligible, bool isOfLegalAge)
    {
        var authService = new Mock<IAuthService>();
        authService
            .Setup(service => service.GetAuthenticatedUser("player-1"))
            .Returns(new AuthenticatedUserResponse("player-1", "demo", isEligible, isOfLegalAge, 125.50m, "US"));
        var contentService = new Mock<IGameContentService>();
        var service = new LaunchService(authService.Object, contentService.Object);

        var response = service.CheckEligibility("player-1", "solar-spins");

        Assert.False(response.IsEligible);
    }

    [Fact]
    public void CheckEligibility_DeniesUnavailableGames()
    {
        var authService = new Mock<IAuthService>();
        authService
            .Setup(service => service.GetAuthenticatedUser("player-1"))
            .Returns(new AuthenticatedUserResponse("player-1", "demo", true, true, 125.50m, "US"));
        var contentService = new Mock<IGameContentService>();
        contentService.Setup(service => service.GetGameById("missing")).Returns((GameResponse?)null);
        var service = new LaunchService(authService.Object, contentService.Object);

        var response = service.CheckEligibility("player-1", "missing");

        Assert.False(response.IsEligible);
        Assert.Contains("no longer available", response.Message);
    }

    [Theory]
    [InlineData("RO", "solar-spins", true)]
    [InlineData("RO", "moonlit-mahjong", true)]
    [InlineData("DE", "solar-spins", false)]
    [InlineData("de", "moonlit-mahjong", false)]
    [InlineData("DE", "dragons-hoard", true)]
    public void CheckEligibility_AppliesGermanGameRestrictions(string country, string gameId, bool expectedEligibility)
    {
        var authService = new Mock<IAuthService>();
        authService
            .Setup(service => service.GetAuthenticatedUser("player-3"))
            .Returns(new AuthenticatedUserResponse("player-3", "test", true, true, 125.50m, country));
        var contentService = new Mock<IGameContentService>();
        contentService
            .Setup(service => service.GetGameById(gameId))
            .Returns(new GameResponse(gameId, gameId, "Test", "Test game.", null));
        var service = new LaunchService(authService.Object, contentService.Object);

        var response = service.CheckEligibility("player-3", gameId);

        Assert.Equal(expectedEligibility, response.IsEligible);
        if (!expectedEligibility)
        {
            Assert.Contains("not available in your country", response.Message);
        }
    }
}
