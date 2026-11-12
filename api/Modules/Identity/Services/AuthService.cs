using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using GamingPlatform.Api.Models.DTOs.Auth;
using GamingPlatform.Api.Modules.Identity.Abstractions;
using GamingPlatform.Api.Modules.Identity.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace GamingPlatform.Api.Modules.Identity.Services;

public sealed class AuthService : IAuthService
{
    private readonly IUserStore _userStore;
    private readonly IPasswordHasher<UserRecord> _passwordHasher;
    private readonly JwtOptions _jwtOptions;

    public AuthService(
        IUserStore userStore,
        IPasswordHasher<UserRecord> passwordHasher,
        JwtOptions jwtOptions)
    {
        _userStore = userStore;
        _passwordHasher = passwordHasher;
        _jwtOptions = jwtOptions;
    }

    public LoginResponse? Login(LoginRequest request)
    {
        var user = _userStore.FindByUsername(request.Username);
        if (user is null ||
            _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) ==
            PasswordVerificationResult.Failed)
        {
            return null;
        }

        var expiresAt = DateTimeOffset.UtcNow.AddMinutes(_jwtOptions.LifetimeMinutes);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim("isEligibleToPlay", user.IsEligibleToPlay.ToString().ToLowerInvariant()),
        };
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SigningKey));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            _jwtOptions.Issuer,
            _jwtOptions.Audience,
            claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: credentials);
        var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
        var authenticatedUser = ToAuthenticatedUserResponse(user);

        return new LoginResponse(accessToken, expiresAt, authenticatedUser);
    }

    public AuthenticatedUserResponse? GetAuthenticatedUser(string userId)
    {
        var user = _userStore.FindById(userId);
        return user is null ? null : ToAuthenticatedUserResponse(user);
    }

    private static AuthenticatedUserResponse ToAuthenticatedUserResponse(UserRecord user)
    {
        var isOfLegalAge = user.DateOfBirth is { } dateOfBirth &&
            DateOnly.FromDateTime(DateTime.UtcNow) >= dateOfBirth.AddYears(18);

        return new AuthenticatedUserResponse(
            user.Id,
            user.Username,
            user.IsEligibleToPlay,
            isOfLegalAge,
            user.WalletBalance,
            user.Country);
    }
}
