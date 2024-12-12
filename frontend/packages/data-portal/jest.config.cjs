/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/setupTests.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['./e2e'],

  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/app/$1',
    '^(.*).png$': '<rootDir>/app/utils/fileMock.ts',
  },

  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
}
