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
    // Resolve react-router to its CommonJS build so `jest.mock('react-router')`
    // (see app/mocks/Remix.mock.ts) applies; its ESM build can't be mocked
    // with jest.mock.
    '^react-router$':
      '<rootDir>/node_modules/react-router/dist/development/index.js',
  },

  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
}
