/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testTimeout: 10000,
  preset: 'ts-jest/presets/default-esm',
  setupFilesAfterEnv: ['@testing-library/jest-dom', '<rootDir>/setupTests.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['./e2e'],

  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/app/$1',
    '^(.*).png$': '<rootDir>/app/utils/fileMock.ts',
    '^(.*).module.css$': 'identity-obj-proxy',
  },

  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
}
