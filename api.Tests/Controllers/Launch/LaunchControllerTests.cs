using System.Security.Claims;
using GamingPlatform.Api.Controllers.Launch;
using GamingPlatform.Api.Models.DTOs.Launch;
using GamingPlatform.Api.Modules.Launch.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace GamingPlatform.Api.Tests.Controllers.Launch;

public class LaunchControllerTests
{
    [Fact]
    public void CheckEligibility_UsesAuthenticatedUserAndGame()
    {
        var response = new EligibilityCheckResponse(true, "Game ready to load.");
        var launchService = new Mock<ILaunchService>();
        launchService
            .Setup(service => service.CheckEligibility("player-1", "solar-spins"))
            .Returns(response);
        var controller = CreateController(launchService.Object, "player-1");

        var result = controller.CheckEligibility(new EligibilityCheckRequest { GameId = "solar-spins" });

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(response, okResult.Value);
        launchService.Verify(service => service.CheckEligibility("player-1", "solar-spins"), Times.Once);
    }

    [Fact]
    public void CheckEligibility_RejectsMissingSubjectClaim()
    {
        var launchService = new Mock<ILaunchService>();
        var controller = CreateController(launchService.Object, null);

        var result = controller.CheckEligibility(new EligibilityCheckRequest { GameId = "solar-spins" });

        Assert.IsType<UnauthorizedResult>(result.Result);
        launchService.VerifyNoOtherCalls();
    }

    private static LaunchController CreateController(ILaunchService launchService, string? userId)
    {
        var claims = userId is null ? [] : new[] { new Claim("sub", userId) };
        return new LaunchController(launchService)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(new ClaimsIdentity(claims, "test")),
                },
            },
        };
    }
}
