using GamingPlatform.Api.Controllers.Games;
using GamingPlatform.Api.Models.DTOs.Games;
using GamingPlatform.Api.Modules.Content.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace GamingPlatform.Api.Tests.Controllers.Games;

public class GameControllerTests
{
    [Fact]
    public void GetAll_ReturnsAvailableGames()
    {
        var games = new[] { new GameResponse("solar-spins", "Solar Spins", "Slots", "Demo game.", null) };
        var gameContentService = new Mock<IGameContentService>();
        gameContentService.Setup(service => service.GetAvailableGames()).Returns(games);
        var controller = new GameController(gameContentService.Object);

        var result = controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(games, okResult.Value);
    }

    [Fact]
    public void GetById_ReturnsNotFoundForUnknownGame()
    {
        var gameContentService = new Mock<IGameContentService>();
        gameContentService.Setup(service => service.GetGameById("missing")).Returns((GameResponse?)null);
        var controller = new GameController(gameContentService.Object);

        var result = controller.GetById("missing");

        Assert.IsType<NotFoundResult>(result.Result);
    }
}
