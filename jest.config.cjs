module.exports = {
  testEnvironment: "jsdom",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|svg|webp)$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(css|less|scss)$": "<rootDir>/src/__mocks__/styleMock.js",
    "^(.*)/utils/videoConstants$": "<rootDir>/src/__mocks__/videoConstants.js",
    "^(.*)/utils/videoConstants\\.js$": "<rootDir>/src/__mocks__/videoConstants.js",
  },
  setupFiles: ["<rootDir>/src/testPolyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(axios|@reduxjs/toolkit|redux|redux-thunk|reselect|immer|react-redux|react-router|react-router-dom)/)",
  ],

};
