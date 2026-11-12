using GamingPlatform.Api.Models.DTOs.Games;

namespace GamingPlatform.Api.Modules.Content.Abstractions;

public interface IGameContentService
{
    IReadOnlyList<GameResponse> GetAvailableGames();
    GameResponse? GetGameById(string id);
}
