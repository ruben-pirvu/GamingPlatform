using GamingPlatform.Api.Modules.Identity.Abstractions;
using GamingPlatform.Api.Modules.Identity.Models;
using GamingPlatform.Api.Modules.Identity.Services;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace GamingPlatform.Api.Tests.Modules.Identity.Services;

public class AuthServiceTests
{
    [Theory]
    [InlineData(18, true)]
    [InlineData(17, false)]
    [InlineData(-1, false)]
    public void GetAuthenticatedUser_ReportsAgeEligibility(int yearsAgo, bool expectedEligibility)
    {
        var dateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow).AddYears(-yearsAgo);
        var user = new UserRecord(
            "player-1",
            "demo",
            "hashed-password",
            true,
            "private-government-id",
            125.50m,
            "US",
            dateOfBirth);
        var userStore = new Mock<IUserStore>();
        userStore.Setup(store => store.FindById(user.Id)).Returns(user);
        var service = new AuthService(
            userStore.Object,
            new PasswordHasher<UserRecord>(),
            new JwtOptions { SigningKey = "test-signing-key-with-at-least-32-bytes" });

        var response = service.GetAuthenticatedUser(user.Id);

        Assert.NotNull(response);
        Assert.Equal(expectedEligibility, response.IsOfLegalAge);
        Assert.Equal(125.50m, response.WalletBalance);
        Assert.Equal("US", response.Country);
    }

    [Fact]
    public void GetAuthenticatedUser_DeniesMissingDateOfBirth()
    {
        var user = new UserRecord("player-1", "demo", "hashed-password", true);
        var userStore = new Mock<IUserStore>();
        userStore.Setup(store => store.FindById(user.Id)).Returns(user);
        var service = new AuthService(
            userStore.Object,
            new PasswordHasher<UserRecord>(),
            new JwtOptions { SigningKey = "test-signing-key-with-at-least-32-bytes" });

        var response = service.GetAuthenticatedUser(user.Id);

        Assert.NotNull(response);
        Assert.False(response.IsOfLegalAge);
    }
}
