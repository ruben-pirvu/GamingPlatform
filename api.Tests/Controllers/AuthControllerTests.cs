using GamingPlatform.Api.Controllers;
using GamingPlatform.Api.Models.DTOs.Auth;
using GamingPlatform.Api.Modules.Identity.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace GamingPlatform.Api.Tests.Controllers;

public class AuthControllerTests
{
    [Fact]
    public void Login_ReturnsTokenForValidCredentials()
    {
        var request = new LoginRequest { Username = "demo", Password = "DemoPass123!" };
        var expectedResponse = new LoginResponse(
            "signed-token",
            DateTimeOffset.UtcNow.AddMinutes(60),
            new AuthenticatedUserResponse("player-1", "demo", true));
        var authService = new Mock<IAuthService>();
        authService.Setup(service => service.Login(request)).Returns(expectedResponse);
        var controller = new AuthController(authService.Object);

        var result = controller.Login(request);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(expectedResponse, okResult.Value);
    }

    [Fact]
    public void Login_ReturnsUnauthorizedForInvalidCredentials()
    {
        var request = new LoginRequest { Username = "demo", Password = "incorrect" };
        var authService = new Mock<IAuthService>();
        authService.Setup(service => service.Login(request)).Returns((LoginResponse?)null);
        var controller = new AuthController(authService.Object);

        var result = controller.Login(request);

        Assert.IsType<UnauthorizedResult>(result.Result);
    }
}
