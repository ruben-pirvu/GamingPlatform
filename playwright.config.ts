import { randomBytes } from 'node:crypto';
import { defineConfig } from '@playwright/test';

const e2eSigningKey = randomBytes(32).toString('base64');

export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'dotnet run --no-launch-profile --project api/GamingPlatform.Api.csproj',
      url: 'http://localhost:5000/api/games',
      env: {
        ASPNETCORE_ENVIRONMENT: 'Development',
        ASPNETCORE_URLS: 'http://localhost:5000',
        Authentication__Jwt__SigningKey: e2eSigningKey,
      },
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'npm start -- --host 127.0.0.1 --port 4200',
      url: 'http://127.0.0.1:4200',
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
