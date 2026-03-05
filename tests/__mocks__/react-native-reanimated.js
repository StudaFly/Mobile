const createAnimatedComponent = jest.fn((component) => component);

const Reanimated = {
  __esModule: true,
  default: {
    View: 'Animated.View',
    Text: 'Animated.Text',
    Image: 'Animated.Image',
    ScrollView: 'Animated.ScrollView',
    createAnimatedComponent,
    addWhitelistedNativeProps: jest.fn(),
  },
  createAnimatedComponent,
  useSharedValue: jest.fn((value) => ({ value })),
  useAnimatedStyle: jest.fn((fn) => {
    try { return fn(); } catch { return {}; }
  }),
  useAnimatedProps: jest.fn((fn) => {
    try { return fn(); } catch { return {}; }
  }),
  withSpring: jest.fn((value) => value),
  withTiming: jest.fn((value) => value),
  withDelay: jest.fn((_, animation) => animation),
  withSequence: jest.fn((...animations) => animations[animations.length - 1]),
  withRepeat: jest.fn((animation) => animation),
  runOnJS: jest.fn((fn) => fn),
  runOnUI: jest.fn((fn) => fn),
  interpolate: jest.fn((value) => value),
  Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  useAnimatedRef: jest.fn(() => ({ current: null })),
  useAnimatedScrollHandler: jest.fn(() => ({})),
  useDerivedValue: jest.fn((fn) => ({ value: fn() })),
  useAnimatedReaction: jest.fn(),
  cancelAnimation: jest.fn(),
  measure: jest.fn(),
  scrollTo: jest.fn(),
  Animated: {
    View: 'Animated.View',
    Text: 'Animated.Text',
    Image: 'Animated.Image',
    createAnimatedComponent,
  },
};

module.exports = Reanimated;
