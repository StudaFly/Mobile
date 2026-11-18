import Constants, { ExecutionEnvironment } from 'expo-constants';
import { env } from '@/core/config/env';

type GoogleSignInModule = typeof import('@react-native-google-signin/google-signin');

/** Android "DEVELOPER_ERROR": package name / SHA-1 not registered on the Google Cloud project. */
const ANDROID_DEVELOPER_ERROR = '10';

const NATIVE_MODULE_MISSING_MESSAGE =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient
    ? "La connexion Google n'est pas disponible dans Expo Go : lance l'app avec un build de développement (npx expo run:ios / run:android)."
    : "La connexion Google n'est pas incluse dans ce build : recompile l'app (npx expo prebuild puis npx expo run:ios / run:android).";

let sdk: GoogleSignInModule | null = null;

/**
 * Loads the native module on first use only: importing it at startup crashes the whole app
 * when the binary does not contain it (Expo Go, outdated dev build).
 */
async function loadConfiguredSdk(): Promise<GoogleSignInModule> {
  if (sdk) return sdk;
  if (!env.GOOGLE_WEB_CLIENT_ID) {
    throw new Error("La connexion Google n'est pas configurée (EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID manquant).");
  }

  let loaded: GoogleSignInModule;
  try {
    // Lazy require on purpose (see above): a static import would throw at app startup.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    loaded = require('@react-native-google-signin/google-signin') as GoogleSignInModule;
  } catch {
    throw new Error(NATIVE_MODULE_MISSING_MESSAGE);
  }

  loaded.GoogleSignin.configure({
    // The ID token is issued for the web client: it is the audience the backend checks.
    webClientId: env.GOOGLE_WEB_CLIENT_ID,
    iosClientId: env.GOOGLE_IOS_CLIENT_ID || undefined,
  });
  sdk = loaded;
  return loaded;
}

function toUserError({ isErrorWithCode, statusCodes }: GoogleSignInModule, error: unknown): Error {
  if (isErrorWithCode(error)) {
    if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return new Error('Les services Google Play sont indisponibles ou doivent être mis à jour.');
    }
    if (error.code === ANDROID_DEVELOPER_ERROR) {
      return new Error('Connexion Google mal configurée pour cette application (empreinte SHA-1 / package).');
    }
  }
  return new Error('La connexion avec Google a échoué. Réessaie.');
}

export const googleSignInService = {
  /**
   * Opens the native Google sign-in and returns the ID token to send to the backend.
   * Resolves to null when the user cancels (or a sign-in is already in progress).
   */
  async getIdToken(): Promise<string | null> {
    const google = await loadConfiguredSdk();
    const { GoogleSignin, isCancelledResponse, isErrorWithCode, statusCodes } = google;
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Always show the account picker instead of silently reusing the last account.
      if (GoogleSignin.hasPreviousSignIn()) {
        await GoogleSignin.signOut();
      }
      const response = await GoogleSignin.signIn();
      if (isCancelledResponse(response)) return null;
      if (!response.data.idToken) {
        throw new Error('Google n’a pas renvoyé de jeton d’identité.');
      }
      return response.data.idToken;
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        (error.code === statusCodes.SIGN_IN_CANCELLED || error.code === statusCodes.IN_PROGRESS)
      ) {
        return null;
      }
      if (error instanceof Error && !isErrorWithCode(error)) throw error;
      throw toUserError(google, error);
    }
  },
};
