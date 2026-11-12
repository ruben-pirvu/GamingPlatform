using GamingPlatform.Api.Modules.Identity.Models;

namespace GamingPlatform.Api.Modules.Identity.Abstractions;

public interface IUserStore
{
    UserRecord? FindByUsername(string username);
}
