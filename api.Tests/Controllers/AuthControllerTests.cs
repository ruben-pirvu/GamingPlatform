using GamingPlatform.Api.Controllers;
using GamingPlatform.Api.Models.DTOs.Auth;
using GamingPlatform.Api.Modules.Identity.Abstractions;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
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
            new AuthenticatedUserResponse("player-1", "demo", true, true, 125.50m, "US"));
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

    [Fact]
    public void Me_ReturnsPublicUserDetailsForAuthenticatedUser()
    {
        var expectedResponse = new AuthenticatedUserResponse("player-1", "demo", true, true, 125.50m, "US");
        var authService = new Mock<IAuthService>();
        authService.Setup(service => service.GetAuthenticatedUser("player-1")).Returns(expectedResponse);
        var controller = new AuthController(authService.Object)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(
                        new ClaimsIdentity([new Claim("sub", "player-1")], "test")),
                },
            },
        };

        var result = controller.Me();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(expectedResponse, okResult.Value);
    }
}
