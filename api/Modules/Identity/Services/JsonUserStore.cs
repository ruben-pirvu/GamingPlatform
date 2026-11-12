using System.Text.Json;
using GamingPlatform.Api.Modules.Identity.Abstractions;
using GamingPlatform.Api.Modules.Identity.Models;

namespace GamingPlatform.Api.Modules.Identity.Services;

public sealed class JsonUserStore : IUserStore
{
    private readonly IReadOnlyList<UserRecord> _users;

    public JsonUserStore(IWebHostEnvironment environment)
    {
        var path = Path.Combine(environment.ContentRootPath, "Modules", "Identity", "Data", "users.json");
        var json = File.ReadAllText(path);
        var users = JsonSerializer.Deserialize<UserRecord[]>(json, JsonSerializerOptions.Web);

        if (users is null || users.Length == 0)
        {
            throw new InvalidDataException($"The users file '{path}' must contain at least one user.");
        }

        if (users.Any(user =>
                string.IsNullOrWhiteSpace(user.Id) ||
                string.IsNullOrWhiteSpace(user.Username) ||
                string.IsNullOrWhiteSpace(user.PasswordHash) ||
                string.IsNullOrWhiteSpace(user.Country) ||
                user.WalletBalance < 0))
        {
            throw new InvalidDataException($"The users file '{path}' contains an incomplete user record.");
        }

        if (users.Select(user => user.Username).Distinct(StringComparer.OrdinalIgnoreCase).Count() != users.Length)
        {
            throw new InvalidDataException($"The users file '{path}' contains duplicate usernames.");
        }

        _users = users;
    }

    public UserRecord? FindByUsername(string username)
    {
        return _users.FirstOrDefault(user =>
            string.Equals(user.Username, username, StringComparison.OrdinalIgnoreCase));
    }

    public UserRecord? FindById(string id)
    {
        return _users.FirstOrDefault(user => string.Equals(user.Id, id, StringComparison.Ordinal));
    }
}
