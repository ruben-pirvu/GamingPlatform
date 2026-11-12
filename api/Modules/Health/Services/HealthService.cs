using GamingPlatform.Api.Models.DTOs.Health;
using GamingPlatform.Api.Modules.Health.Abstractions;

namespace GamingPlatform.Api.Modules.Health.Services;

public sealed class HealthService : IHealthService
{
    public HealthStatusDto GetStatus()
    {
        return new HealthStatusDto("ok");
    }
}
