module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/.expo/"],
  testMatch: ["**/tests/unit/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "babel-jest",
  },
};
