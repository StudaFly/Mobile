import type { GoogleSignin as GoogleSigninType } from '@react-native-google-signin/google-signin';

type Service = typeof import('../../../src/features/auth/services/googleSignIn.service').googleSignInService;
type Sdk = jest.Mocked<typeof GoogleSigninType>;

function codedError(code: string): Error {
  return Object.assign(new Error(code), { code });
}

function sdkMockFactory() {
  return {
    GoogleSignin: {
      configure: jest.fn(),
      hasPlayServices: jest.fn(() => Promise.resolve(true)),
      hasPreviousSignIn: jest.fn(() => false),
      signIn: jest.fn(() => Promise.resolve({ type: 'cancelled', data: null })),
      signOut: jest.fn(() => Promise.resolve(null)),
    },
    isCancelledResponse: (response: { type: string }) => response.type === 'cancelled',
    isErrorWithCode: (error: unknown) =>
      error instanceof Error && typeof (error as Error & { code?: unknown }).code === 'string',
    statusCodes: {
      SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
      IN_PROGRESS: 'IN_PROGRESS',
      PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
    },
  };
}

/**
 * Fresh module registry for each test: the service requires the SDK lazily (at call time),
 * so the service, its env and the SDK mock must all live in the same registry.
 */
function load(
  webClientId = 'web-client-id',
  sdkFactory: () => unknown = sdkMockFactory,
): { service: Service; sdk: Sdk } {
  jest.resetModules();
  jest.doMock('../../../src/core/config/env', () => ({
    env: { GOOGLE_WEB_CLIENT_ID: webClientId, GOOGLE_IOS_CLIENT_ID: 'ios-client-id' },
  }));
  jest.doMock('@react-native-google-signin/google-signin', sdkFactory);
  return {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    service: require('../../../src/features/auth/services/googleSignIn.service').googleSignInService,
    // Not required when the factory throws (native module missing).
    get sdk(): Sdk {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('@react-native-google-signin/google-signin').GoogleSignin;
    },
  };
}

function success(idToken: string | null) {
  return { type: 'success', data: { idToken } } as never;
}

describe('googleSignInService.getIdToken', () => {
  it('configures the SDK with the web client ID (backend audience) and returns the ID token', async () => {
    const { service, sdk } = load();
    sdk.signIn.mockResolvedValue(success('real-id-token'));

    await expect(service.getIdToken()).resolves.toBe('real-id-token');
    expect(sdk.configure).toHaveBeenCalledWith({ webClientId: 'web-client-id', iosClientId: 'ios-client-id' });
  });

  it('configures the SDK only once', async () => {
    const { service, sdk } = load();
    sdk.signIn.mockResolvedValue(success('t'));

    await service.getIdToken();
    await service.getIdToken();
    expect(sdk.configure).toHaveBeenCalledTimes(1);
  });

  it('signs out a previous Google session so the account picker is shown', async () => {
    const { service, sdk } = load();
    sdk.hasPreviousSignIn.mockReturnValue(true);
    sdk.signIn.mockResolvedValue(success('t'));

    await service.getIdToken();
    expect(sdk.signOut).toHaveBeenCalled();
  });

  it('returns null when the user cancels', async () => {
    const { service, sdk } = load();
    sdk.signIn.mockResolvedValue({ type: 'cancelled', data: null } as never);
    await expect(service.getIdToken()).resolves.toBeNull();
  });

  it.each(['SIGN_IN_CANCELLED', 'IN_PROGRESS'])('returns null on %s', async (code) => {
    const { service, sdk } = load();
    sdk.signIn.mockRejectedValue(codedError(code));
    await expect(service.getIdToken()).resolves.toBeNull();
  });

  it('throws when Google returns no ID token', async () => {
    const { service, sdk } = load();
    sdk.signIn.mockResolvedValue(success(null));
    await expect(service.getIdToken()).rejects.toThrow('jeton d’identité');
  });

  it('explains missing Play Services', async () => {
    const { service, sdk } = load();
    sdk.hasPlayServices.mockRejectedValue(codedError('PLAY_SERVICES_NOT_AVAILABLE'));
    await expect(service.getIdToken()).rejects.toThrow('Google Play');
  });

  it('explains an Android DEVELOPER_ERROR (SHA-1 / package not registered)', async () => {
    const { service, sdk } = load();
    sdk.signIn.mockRejectedValue(codedError('10'));
    await expect(service.getIdToken()).rejects.toThrow('SHA-1');
  });

  it('falls back to a generic message for other native errors', async () => {
    const { service, sdk } = load();
    sdk.signIn.mockRejectedValue(codedError('SOMETHING_ELSE'));
    await expect(service.getIdToken()).rejects.toThrow('La connexion avec Google a échoué');
  });

  it('does not crash when the native module is missing (Expo Go) and explains how to fix it', async () => {
    const { service } = load('web-client-id', () => {
      throw new Error("TurboModuleRegistry.getEnforcing(...): 'RNGoogleSignin' could not be found.");
    });

    await expect(service.getIdToken()).rejects.toThrow('npx expo run:');
  });

  it('refuses to start when the web client ID is not configured', async () => {
    const { service, sdk } = load('');
    await expect(service.getIdToken()).rejects.toThrow('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');
    expect(sdk.signIn).not.toHaveBeenCalled();
  });
});
