using GamingPlatform.Api.Models.DTOs.Games;
using GamingPlatform.Api.Modules.Content.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace GamingPlatform.Api.Controllers.Games;

[ApiController]
[Route("api/games")]
public sealed class GameController(IGameContentService gameContentService) : ControllerBase
{
    /// <summary>Returns the available game catalog.</summary>
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<GameResponse>>(StatusCodes.Status200OK)]
    public ActionResult<IReadOnlyList<GameResponse>> GetAll()
    {
        return Ok(gameContentService.GetAvailableGames());
    }

    /// <summary>Returns a game by its catalog ID.</summary>
    [HttpGet("{id}")]
    [ProducesResponseType<GameResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<GameResponse> GetById(string id)
    {
        var game = gameContentService.GetGameById(id);
        return game is null ? NotFound() : Ok(game);
    }
}
