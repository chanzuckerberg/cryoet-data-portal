/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['./e2e'],

  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/app/$1',
  },
}
