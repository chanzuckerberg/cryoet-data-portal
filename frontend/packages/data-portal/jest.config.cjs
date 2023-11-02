/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/app/$1',
  },
}
