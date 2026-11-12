using GamingPlatform.Api.Models.DTOs.Auth;

namespace GamingPlatform.Api.Modules.Identity.Abstractions;

public interface IAuthService
{
    LoginResponse? Login(LoginRequest request);
    AuthenticatedUserResponse? GetAuthenticatedUser(string userId);
}
