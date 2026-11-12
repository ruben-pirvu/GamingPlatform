using GamingPlatform.Api.Models.DTOs.Health;

namespace GamingPlatform.Api.Modules.Health.Abstractions;

public interface IHealthService
{
    HealthStatusDto GetStatus();
}
