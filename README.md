# StudaFly Mobile

> Mobile app for StudaFly - Prepare your international mobility, serenely.

![CI](https://github.com/StudaFly/Mobile/actions/workflows/ci.yml/badge.svg)

## Prerequisites

- Node.js and **pnpm**
- **iOS**: macOS with Xcode (and an iOS simulator, or an iPhone plugged in)
- **Android**: Android Studio (an emulator, or a phone with USB debugging enabled)
- The backend running (`make dev` in `backend/`, API on port 8080)

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Environment variables
cp .env.example .env   # then fill in the Google client IDs (ask the team)

# 3. Build and launch the app (first time, and after any native change)
npx expo run:ios       # or: npx expo run:android
```

`npx expo run:*` compiles a **development build** (the StudaFly app with its own native modules),
installs it on the simulator / emulator / plugged-in device and starts Metro.

On the following days, as long as nothing native changed, no rebuild is needed:

```bash
pnpm dev               # start Metro, then open the StudaFly app already installed
```

**Rebuild** (`npx expo run:ios` / `run:android`) after adding or updating a native dependency, or
after changing `app.json` (plugins, bundle ID…). If the native projects look out of sync, regenerate
them with `npx expo prebuild --clean` and rebuild.

### Why not Expo Go?

The app uses native modules that Expo Go does not contain, starting with **Google Sign-In**
(`@react-native-google-signin/google-signin`). In Expo Go the app starts, but the
"Continuer avec Google" button shows an error. Use a development build.

## Scripts

| Command | Description |
|----------|-------------|
| `npx expo run:ios` | Builds and runs the development build on iOS (add `--device` for a plugged-in iPhone) |
| `npx expo run:android` | Builds and runs the development build on Android (add `--device` for a plugged-in phone) |
| `pnpm dev` | Starts Metro (the app must already be installed) |
| `pnpm start:tunnel` | Starts Metro + an ngrok tunnel to the API (see below) |
| `pnpm lint` | Checks the code with ESLint |
| `pnpm typecheck` | Checks TypeScript types |
| `pnpm test` | Runs the tests |
| `pnpm test:coverage` | Tests with coverage |
| `pnpm test:e2e` | Runs the Maestro E2E tests (`.maestro/`) |

> `pnpm ios` / `pnpm android` run `expo start --ios|--android`, which open **Expo Go** when no
> development client is installed: prefer `npx expo run:ios|android`.

## Environment variables

Defined in `.env` (template: [`.env.example`](.env.example)). After changing one, restart Metro with
`pnpm dev --clear`.

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | yes (Google login) | OAuth **Web** client ID. Must be **the same value** as `GOOGLE_CLIENT_ID` in the backend: it is the audience the backend checks. |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | yes on iOS | OAuth **iOS** client ID (bundle ID `com.studafly.mobile`). |
| `EXPO_PUBLIC_API_URL` | no | API URL. By default the app targets the computer running Metro. |

## Connecting to the backend

| Situation | Command |
|---|---|
| Simulator / emulator, or phone on the **same network** as the computer | `pnpm dev` |
| School / corporate network (devices isolated from each other), 4G, another network | `pnpm start:tunnel` |

- `pnpm dev`: the app automatically targets the computer running Metro
  (`http://<IP>:8080/api/v1`), nothing to configure.
- `pnpm start:tunnel`: opens an **ngrok** tunnel to the API (your ngrok account:
  `brew install ngrok`, then `ngrok config add-authtoken <token>`), starts Expo in tunnel mode and
  passes the public URL to the app. Loading the app through the tunnel requires a development build
  that includes `expo-dev-client` (not installed in the project yet).
- To target another server: `EXPO_PUBLIC_API_URL` in `.env`, then `pnpm dev --clear`.

If the API cannot be reached, a **red banner** at the top of the app shows the target URL and what
to do (tap it to retry).

## Google Sign-In

The app opens the native Google sign-in, gets an **ID token** and sends it to
`POST /auth/oauth/google` (`{ "idToken": "..." }`); the backend verifies it.

Google Cloud Console setup (same project as the backend):

- **Web** OAuth client → its ID goes in `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` (and `GOOGLE_CLIENT_ID` in the backend).
- **iOS** OAuth client with bundle ID `com.studafly.mobile` → `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`.
  Its reversed form (`com.googleusercontent.apps.…`) is the `iosUrlScheme` of the Google plugin in `app.json`.
- **Android** OAuth client with package `com.studafly.mobile` and the **SHA-1** of the signing key.
  Get the debug one with:

  ```bash
  keytool -list -v -keystore android/app/debug.keystore -storepass android -alias androiddebugkey | grep SHA1
  ```

  Each developer building with a different debug keystore must add their SHA-1.

Apple and Microsoft sign-in are not implemented by the backend yet: their buttons show
"Cette méthode de connexion arrive bientôt".

## Troubleshooting

| Error | Cause / fix |
|---|---|
| `'RNGoogleSignin' could not be found` (old versions crashed at startup) | The app runs in Expo Go or in a build compiled before the dependency was added → rebuild with `npx expo run:ios` / `run:android`. |
| iOS build: `Script 'Bundle React Native code and images' failed` … `/…/EIP: No such file or directory` | Path containing spaces. Fixed by the `plugins/withQuotedBundleScript.js` config plugin: run `npx expo prebuild` then rebuild. Moving the repo to a path without spaces avoids this whole class of issues. |
| "Connexion Google mal configurée … (empreinte SHA-1 / package)" on Android | The SHA-1 of your keystore is not registered on the Android OAuth client (see above). |
| `401 Invalid Google token` from the API | `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` differs from the backend `GOOGLE_CLIENT_ID`. |
| An `EXPO_PUBLIC_*` change is ignored | Restart Metro with `pnpm dev --clear`. |

## Stack

- React Native 0.86
- Expo SDK 57
- TypeScript 6
- Jest + Testing Library
- Google Sign-In: `@react-native-google-signin/google-signin`

## Code Owner

@tframboise
