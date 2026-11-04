import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { env } from '@/core/config/env';

/** The user closed the Google sheet: not an error worth showing. */
export class GoogleSignInCancelledError extends Error {
  constructor() {
    super('Connexion Google annulée');
    this.name = 'GoogleSignInCancelledError';
  }
}

let isConfigured = false;

function ensureConfigured(): void {
  if (!env.GOOGLE_WEB_CLIENT_ID) {
    throw new Error("La connexion Google n'est pas configurée.");
  }
  if (isConfigured) return;
  GoogleSignin.configure({
    // The ID token is issued for the web client: that is the audience checked by the backend.
    webClientId: env.GOOGLE_WEB_CLIENT_ID,
    iosClientId: env.GOOGLE_IOS_CLIENT_ID || undefined,
  });
  isConfigured = true;
}

function toReadableError(err: unknown): Error {
  if (err instanceof GoogleSignInCancelledError) return err;
  if (isErrorWithCode(err)) {
    switch (err.code) {
      case statusCodes.SIGN_IN_CANCELLED:
        return new GoogleSignInCancelledError();
      case statusCodes.IN_PROGRESS:
        return new Error('Une connexion Google est déjà en cours.');
      case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
        return new Error('Les services Google Play sont indisponibles ou doivent être mis à jour.');
    }
  }
  return new Error('La connexion Google a échoué. Réessaie.');
}

export const googleSignInService = {
  /** Open the native Google account picker and return the ID token to send to the backend. */
  async getIdToken(): Promise<string> {
    ensureConfigured();
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      if (isCancelledResponse(response)) throw new GoogleSignInCancelledError();
      if (!response.data.idToken) throw new Error('Google did not return an ID token');
      return response.data.idToken;
    } catch (err) {
      throw toReadableError(err);
    }
  },

  /** Forget the Google account locally so the next sign-in shows the account picker again. */
  async signOut(): Promise<void> {
    if (!isConfigured) return;
    try {
      await GoogleSignin.signOut();
    } catch {
      // Nothing to sign out from.
    }
  },
};

export function isGoogleSignInCancelled(err: unknown): boolean {
  return err instanceof GoogleSignInCancelledError;
}
