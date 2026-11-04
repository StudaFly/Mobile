const mockGoogleSignin = {
  configure: jest.fn(),
  hasPlayServices: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
};

jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: mockGoogleSignin,
  isCancelledResponse: (response: { type: string }) => response.type === 'cancelled',
  isErrorWithCode: (err: unknown) => typeof err === 'object' && err !== null && 'code' in err,
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

const mockEnv = { GOOGLE_WEB_CLIENT_ID: 'web-client-id', GOOGLE_IOS_CLIENT_ID: 'ios-client-id' };
jest.mock('../../../src/core/config/env', () => ({ env: mockEnv }));

type ServiceModule = typeof import('../../../src/features/auth/services/googleSignIn.service');

// The service configures the SDK once: reload it for each test.
function loadService(): ServiceModule {
  let mod: ServiceModule | undefined;
  jest.isolateModules(() => {
    mod = jest.requireActual<ServiceModule>('../../../src/features/auth/services/googleSignIn.service');
  });
  return mod!;
}

const success = (idToken: string | null) => ({ type: 'success', data: { idToken, user: {} } });

describe('googleSignInService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEnv.GOOGLE_WEB_CLIENT_ID = 'web-client-id';
    mockEnv.GOOGLE_IOS_CLIENT_ID = 'ios-client-id';
    mockGoogleSignin.hasPlayServices.mockResolvedValue(true);
    mockGoogleSignin.signIn.mockResolvedValue(success('google-id-token'));
    mockGoogleSignin.signOut.mockResolvedValue(null);
  });

  it('configures the SDK once and returns the ID token', async () => {
    const { googleSignInService } = loadService();

    await expect(googleSignInService.getIdToken()).resolves.toBe('google-id-token');
    await googleSignInService.getIdToken();

    expect(mockGoogleSignin.configure).toHaveBeenCalledTimes(1);
    expect(mockGoogleSignin.configure).toHaveBeenCalledWith({
      webClientId: 'web-client-id',
      iosClientId: 'ios-client-id',
    });
    expect(mockGoogleSignin.hasPlayServices).toHaveBeenCalledWith({ showPlayServicesUpdateDialog: true });
  });

  it('omits the iOS client ID when it is not set', async () => {
    mockEnv.GOOGLE_IOS_CLIENT_ID = '';
    const { googleSignInService } = loadService();

    await googleSignInService.getIdToken();

    expect(mockGoogleSignin.configure).toHaveBeenCalledWith({
      webClientId: 'web-client-id',
      iosClientId: undefined,
    });
  });

  it('fails fast when Google sign-in is not configured', async () => {
    mockEnv.GOOGLE_WEB_CLIENT_ID = '';
    const { googleSignInService } = loadService();

    await expect(googleSignInService.getIdToken()).rejects.toThrow("n'est pas configurée");
    expect(mockGoogleSignin.signIn).not.toHaveBeenCalled();
  });

  it('reports a cancelled response as a cancellation', async () => {
    mockGoogleSignin.signIn.mockResolvedValue({ type: 'cancelled', data: null });
    const { googleSignInService, isGoogleSignInCancelled } = loadService();

    const error = await googleSignInService.getIdToken().catch((err: unknown) => err);

    expect(isGoogleSignInCancelled(error)).toBe(true);
  });

  it('reports the SIGN_IN_CANCELLED code as a cancellation', async () => {
    mockGoogleSignin.signIn.mockRejectedValue({ code: 'SIGN_IN_CANCELLED' });
    const { googleSignInService, isGoogleSignInCancelled } = loadService();

    const error = await googleSignInService.getIdToken().catch((err: unknown) => err);

    expect(isGoogleSignInCancelled(error)).toBe(true);
  });

  it.each([
    ['PLAY_SERVICES_NOT_AVAILABLE', 'services Google Play'],
    ['IN_PROGRESS', 'déjà en cours'],
    ['SOMETHING_ELSE', 'a échoué'],
  ])('turns the %s code into a readable error', async (code, message) => {
    mockGoogleSignin.signIn.mockRejectedValue({ code });
    const { googleSignInService, isGoogleSignInCancelled } = loadService();

    const error = await googleSignInService.getIdToken().catch((err: unknown) => err);

    expect(isGoogleSignInCancelled(error)).toBe(false);
    expect((error as Error).message).toContain(message);
  });

  it('fails when Google returns no ID token', async () => {
    mockGoogleSignin.signIn.mockResolvedValue(success(null));
    const { googleSignInService } = loadService();

    await expect(googleSignInService.getIdToken()).rejects.toThrow('a échoué');
  });

  it('signs out only once the SDK has been used', async () => {
    const { googleSignInService } = loadService();

    await googleSignInService.signOut();
    expect(mockGoogleSignin.signOut).not.toHaveBeenCalled();

    await googleSignInService.getIdToken();
    mockGoogleSignin.signOut.mockRejectedValue(new Error('not signed in'));
    await expect(googleSignInService.signOut()).resolves.toBeUndefined();
    expect(mockGoogleSignin.signOut).toHaveBeenCalledTimes(1);
  });
});
