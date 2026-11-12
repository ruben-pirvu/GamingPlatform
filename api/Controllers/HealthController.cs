using Microsoft.AspNetCore.Mvc;
using GamingPlatform.Api.Models.DTOs.Health;
using GamingPlatform.Api.Modules.Health.Abstractions;

namespace GamingPlatform.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IHealthService _healthService;

    public HealthController(IHealthService healthService)
    {
        _healthService = healthService;
    }

    [HttpGet]
    public ActionResult<HealthStatusDto> Get()
    {
        return Ok(_healthService.GetStatus());
    }
}
