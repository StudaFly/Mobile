#!/usr/bin/env node
/**
 * Start the app for a phone that cannot reach this computer directly
 * (school / corporate Wi-Fi with client isolation, 4G, another network).
 *
 * 1. exposes the local API (port 8080) through ngrok (your ngrok account);
 * 2. starts Expo in tunnel mode (Metro reachable from anywhere);
 * 3. passes the public API URL to the app (EXPO_PUBLIC_API_URL).
 *
 * Usage: pnpm start:tunnel   (the backend must run: `make dev` in backend/)
 */
import { spawn } from 'node:child_process';

const API_PORT = process.env.API_PORT ?? '8080';
const NGROK_API = 'http://127.0.0.1:4040/api/tunnels';

const log = (message) => console.log(`\x1b[36m[tunnel]\x1b[0m ${message}`);
const fail = (message) => {
  console.error(`\x1b[31m[tunnel]\x1b[0m ${message}`);
  process.exit(1);
};
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function checkLocalApi() {
  try {
    const res = await fetch(`http://localhost:${API_PORT}/api/v1/health`);
    if (res.ok) return log(`Local API OK (http://localhost:${API_PORT}).`);
    log(`The API answers ${res.status}: PostgreSQL or Redis is probably down (\`make services\` in backend/).`);
  } catch {
    log(`No API on http://localhost:${API_PORT}. Run \`make dev\` in backend/ (the app shows a banner while the API is unreachable).`);
  }
}

async function waitForPublicUrl() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const res = await fetch(NGROK_API);
      const { tunnels } = await res.json();
      const tunnel = tunnels.find((t) => t.public_url?.startsWith('https://'));
      if (tunnel) return tunnel.public_url;
    } catch {
      // ngrok notready yet
    }
    await sleep(500);
  }
  return null;
}

await checkLocalApi();

log(`Opening an ngrok tunnel to the API (port ${API_PORT})…`);
const ngrok = spawn('ngrok', ['http', API_PORT, '--log', 'stderr'], { stdio: ['ignore', 'ignore', 'pipe'] });
let ngrokErrors = '';
ngrok.stderr.on('data', (chunk) => {
  ngrokErrors += chunk;
});
ngrok.on('error', () => fail("ngrok not found. Install it (`brew install ngrok`), then run `ngrok config add-authtoken <token>`."));

const publicUrl = await waitForPublicUrl();
if (!publicUrl) {
  ngrok.kill();
  fail(`Could not open the ngrok tunnel.\n${ngrokErrors.split('\n').filter((l) => /err|ERR/.test(l)).slice(-3).join('\n')}`);
}

const apiUrl = `${publicUrl}/api/v1`;
log(`API reachable from the phone: ${apiUrl}`);
log('Starting Expo in tunnel mode (scan the QR code with Expo Go)…');

const expo = spawn('npx', ['expo', 'start', '--tunnel', '--clear'], {
  stdio: 'inherit',
  env: { ...process.env, EXPO_PUBLIC_API_URL: apiUrl },
});

const stop = () => {
  ngrok.kill();
  expo.kill();
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
expo.on('exit', (code) => {
  ngrok.kill();
  process.exit(code ?? 0);
});
