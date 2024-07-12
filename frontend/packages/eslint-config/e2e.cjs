module.exports = {
  extends: ['plugin:playwright/recommended'],

  rules: {
    // Useful for testing things sequentially
    'no-await-in-loop': 'off',

    // Allow conditional statements in tests
    'playwright/no-conditional-in-test': 'off',

    // Disable so that we can create utility tester functions. For example some
    // tests use `validateTable()` which should have call `expect()` within the
    // function.
    'playwright/expect-expect': 'off',
  },
}
