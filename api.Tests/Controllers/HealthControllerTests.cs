using GamingPlatform.Api.Controllers;
using GamingPlatform.Api.Models.DTOs.Health;
using GamingPlatform.Api.Modules.Health.Abstractions;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace GamingPlatform.Api.Tests.Controllers;

public class HealthControllerTests
{
    [Fact]
    public void Get_ReturnsStatusFromHealthService()
    {
        var expectedStatus = new HealthStatusDto("ok");
        var healthService = new Mock<IHealthService>();
        healthService.Setup(service => service.GetStatus()).Returns(expectedStatus);
        var controller = new HealthController(healthService.Object);

        var result = controller.Get();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(expectedStatus, okResult.Value);
        healthService.Verify(service => service.GetStatus(), Times.Once);
    }
}
