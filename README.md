# StudaFly Mobile

> Mobile app for StudaFly - Prepare your international mobility, serenely.

![CI](https://github.com/StudaFly/Mobile/actions/workflows/ci.yml/badge.svg)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start in development mode
pnpm start
```

## Scripts

| Command | Description |
|----------|-------------|
| `pnpm start` | Starts Expo |
| `pnpm ios` | Runs on iOS |
| `pnpm android` | Runs on Android |
| `pnpm lint` | Checks the code with ESLint |
| `pnpm typecheck` | Checks TypeScript types |
| `pnpm test` | Runs the tests |
| `pnpm test:coverage` | Tests with coverage |

## Connecting to the backend

Prerequisite: the backend is running (`make dev` in `backend/`, API on port 8080).

| Situation | Command |
|---|---|
| Phone and computer on the **same network** (home, phone hotspot) | `pnpm start` |
| School / corporate network (devices isolated from each other), 4G, another network | `pnpm start:tunnel` |

- `pnpm start`: the app automatically targets the computer running Metro
  (`http://<IP>:8080/api/v1`), nothing to configure.
- `pnpm start:tunnel`: opens an **ngrok** tunnel to the API (your ngrok account:
  `brew install ngrok`, then `ngrok config add-authtoken <token>`), starts Expo in tunnel mode and
  passes the public URL to the app. Works on any network.
- To target another server: `EXPO_PUBLIC_API_URL` in `.env` (see `.env.example`), then
  `pnpm start --clear`.

If the API cannot be reached, a **red banner** at the top of the app shows the target URL and what
to do (tap it to retry).

The app uses native modules (`expo-secure-store`, `react-native-mmkv`…): if Expo Go is not
enough, use a development build (`npx expo run:ios` / `npx expo run:android`).

## Stack

- React Native 0.86
- Expo SDK 57
- TypeScript 6
- Jest + Testing Library

## Code Owner

@tframboise
