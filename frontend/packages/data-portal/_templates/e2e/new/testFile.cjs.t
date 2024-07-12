---
to: e2e/<%= name %>.test.ts
---
import { test } from '@playwright/test'
import { <% h.changeCase.pascal(name) %>Page } from 'e2e/pageObjects/<%= name %>/<%= name %>Page'

test.describe('<%= name %>', () => {
  test('should work', async ({ page }) => {
    const <%= name %>Page = new <% h.changeCase.pascal(name) %>Page(page)
    await <%= name %>Page.goTo('https://playwright.dev/')
  })
})