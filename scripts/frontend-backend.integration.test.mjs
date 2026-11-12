import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { after, before, test } from 'node:test';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiUrl = 'http://localhost:5000';
let api;
let frontend;
let frontendUrl;

function startProcess(command, args, env = {}) {
  const child = spawn(command, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const service = { child, output: '' };

  for (const stream of [child.stdout, child.stderr]) {
    stream.setEncoding('utf8');
    stream.on('data', (chunk) => {
      service.output = `${service.output}${chunk}`.slice(-20_000);
    });
  }

  return service;
}

async function waitForOutput(service, pattern, name) {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    if (pattern.test(service.output)) {
      return;
    }

    if (service.child.exitCode !== null) {
      throw new Error(`${name} exited before becoming ready.\n${service.output}`);
    }

    await delay(200);
  }

  throw new Error(`${name} did not become ready in time.\n${service.output}`);
}

async function getFreePort() {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const { port } = server.address();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  return port;
}

async function waitForHttp(url, service, name) {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    if (service.child.exitCode !== null) {
      throw new Error(`${name} exited before responding.\n${service.output}`);
    }

    try {
      return await fetch(url);
    } catch {
      await delay(200);
    }
  }

  throw new Error(`${name} did not respond in time.\n${service.output}`);
}

async function stopProcess(service) {
  if (!service || service.child.exitCode !== null) {
    return;
  }

  const exited = new Promise((resolve) => service.child.once('exit', resolve));
  service.child.kill();
  await Promise.race([exited, delay(5_000)]);

  if (service.child.exitCode === null) {
    service.child.kill('SIGKILL');
    await exited;
  }
}

before(async () => {
  const build = spawnSync(
    'dotnet',
    ['build', 'api/GamingPlatform.Api.csproj', '--configuration', 'Debug'],
    { cwd: root, stdio: 'inherit' },
  );
  assert.equal(build.status, 0, 'The API must build before running the integration test');

  api = startProcess('dotnet', ['api/bin/Debug/net10.0/GamingPlatform.Api.dll'], {
    ASPNETCORE_ENVIRONMENT: 'Development',
    ASPNETCORE_URLS: apiUrl,
    Authentication__Jwt__SigningKey: randomBytes(32).toString('base64'),
  });
  await waitForOutput(api, /Now listening on: http:\/\/localhost:5000/i, 'ASP.NET API');

  const port = await getFreePort();
  frontendUrl = `http://127.0.0.1:${port}`;
  frontend = startProcess(
    process.execPath,
    [
      path.join(root, 'node_modules', '@angular', 'cli', 'bin', 'ng.js'),
      'serve',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
    ],
  );
  await waitForOutput(
    frontend,
    new RegExp(`Local: http://127\\.0\\.0\\.1:${port}/`),
    'Angular dev server',
  );
});

after(async () => {
  await stopProcess(frontend);
  await stopProcess(api);
});

test('Angular proxies API requests and receives the game catalog', async () => {
  const response = await fetch(`${frontendUrl}/api/games`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type') ?? '', /application\/json/);
  const games = await response.json();
  assert.equal(games.length, 7);
  assert.equal(games[0].id, 'solar-spins');
});
