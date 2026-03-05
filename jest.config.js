module.exports = {
  preset: 'jest-expo',
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
  testMatch: ['**/tests/unit/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.types.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.test.{ts,tsx}',
  ],
  moduleNameMapper: {
    '^react-native-reanimated$': '<rootDir>/tests/__mocks__/react-native-reanimated.js',
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/design-system$': '<rootDir>/src/design-system/index.ts',
    '^@/design-system/(.*)$': '<rootDir>/src/design-system/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1',
    '^@/navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@/providers/(.*)$': '<rootDir>/src/providers/$1',
  },
};
