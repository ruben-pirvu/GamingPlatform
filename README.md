# Gaming Platform

A modular-monolith demo built with an Angular frontend and ASP.NET Core API.

- **Authentication:** JWT sign-in with JSON-backed demo users; game pages require an authenticated, eligible adult.
- **Game library:** Seven sample games from a replaceable JSON content source.
- **Eligibility:** Checks age, account status, game availability, and a demo country rule.
- **Launch:** Shows a waiting screen until a future external game provider is connected.
- **Scope:** No database, live provider, payment/wallet ledger, or regulatory integration.

## Architecture

The supplied [platform diagram](platform-diagram.png) is retained as the **target architecture**, not a complete picture of the running prototype.

- **Implemented:** Angular login, game selection and protected routes; API authentication, game catalog, and eligibility-check controllers; Identity, Content, and Launch services; JSON-backed users and games.
- **Not implemented from the diagram:** A separate `GameView`, external-provider module/result simulator, and real balance or regulatory checks. The current launch component intentionally waits for an external provider.

## Technologies

- Angular 22, TypeScript, RxJS
- ASP.NET Core Web API on .NET 10; JWT bearer authentication and built-in OpenAPI
- JSON user store with hashed passwords
- Vitest and Jest (frontend), xUnit (API), Playwright (end-to-end)

## Run locally

Prerequisites: Node.js 26+, npm, and .NET 10 SDK.

1. Configure a local JWT key (at least 32 characters):

   ```powershell
   dotnet user-secrets set "Authentication:Jwt:SigningKey" "<random-secret-of-at-least-32-characters>" --project api\GamingPlatform.Api.csproj
   ```

2. Start the API with `dotnet run --project api\GamingPlatform.Api.csproj`.
3. In a second terminal, run `npm start` and open <http://localhost:4200>.

Angular proxies `/api` requests to the API on `http://localhost:5000`. API endpoints include `/api/auth/login`, authenticated `/api/auth/me`, `/api/games`, and authenticated `/api/launch/eligibility-check`.

Demo sign-ins: `demo` / `DemoPass123!`, `romania` / `RomaniaPass123!`, and `germany` / `GermanyPass123!`. The `restricted` account is ineligible and under 18.

## Tests

- Angular/Vitest: `npm test -- --watch=false`
- Jest: `npm run test:jest`
- API/xUnit: `dotnet test --project api.Tests\GamingPlatform.Api.Tests.csproj`
- Playwright E2E (starts both apps): `npm run test:e2e`
- API/frontend integration: `npm run test:integration`
