module.exports = {
  testEnvironment: 'node',
  // testMatch: ['<rootDir>/src/tests/**/*.(test).{js,jsx,ts,tsx}'],
  // testMatch: ['<rootDir>/src/tests/integration/*.(test).{js,jsx,ts,tsx}'],
  testMatch: ['<rootDir>/src/tests/*.(test).{js,jsx,ts,tsx}'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  setupFiles: ['./src/tests/fixtures/config.js'],
};
