using System.Text.Json;
using GamingPlatform.Api.Models.DTOs.Games;
using GamingPlatform.Api.Modules.Content.Abstractions;

namespace GamingPlatform.Api.Modules.Content.Services;

public sealed class JsonGameContentService : IGameContentService
{
    private readonly IReadOnlyList<GameResponse> _games;

    public JsonGameContentService(IWebHostEnvironment environment)
    {
        var path = Path.Combine(environment.ContentRootPath, "Modules", "Content", "Data", "games.json");
        var json = File.ReadAllText(path);
        var games = JsonSerializer.Deserialize<GameResponse[]>(json, JsonSerializerOptions.Web);

        if (games is null || games.Length == 0)
        {
            throw new InvalidDataException($"The games file '{path}' must contain at least one game.");
        }

        if (games.Any(game =>
                string.IsNullOrWhiteSpace(game.Id) ||
                string.IsNullOrWhiteSpace(game.Title) ||
                string.IsNullOrWhiteSpace(game.Category) ||
                string.IsNullOrWhiteSpace(game.Description)))
        {
            throw new InvalidDataException($"The games file '{path}' contains an incomplete game record.");
        }

        if (games.Select(game => game.Id).Distinct(StringComparer.OrdinalIgnoreCase).Count() != games.Length)
        {
            throw new InvalidDataException($"The games file '{path}' contains duplicate game IDs.");
        }

        _games = games;
    }

    public IReadOnlyList<GameResponse> GetAvailableGames() => _games;

    public GameResponse? GetGameById(string id)
    {
        return _games.FirstOrDefault(game => string.Equals(game.Id, id, StringComparison.OrdinalIgnoreCase));
    }
}
