using System.IdentityModel.Tokens.Jwt;
using GamingPlatform.Api.Models.DTOs.Launch;
using GamingPlatform.Api.Modules.Launch.Abstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GamingPlatform.Api.Controllers.Launch;

[ApiController]
[Authorize]
[Route("api/launch")]
public sealed class LaunchController(ILaunchService launchService) : ControllerBase
{
    /// <summary>Checks age, account eligibility, and game availability before launch.</summary>
    [HttpPost("eligibility-check")]
    [ProducesResponseType<EligibilityCheckResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult<EligibilityCheckResponse> CheckEligibility(EligibilityCheckRequest request)
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        return Ok(launchService.CheckEligibility(userId, request.GameId));
    }
}
