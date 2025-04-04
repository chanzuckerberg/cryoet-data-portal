---
to: e2e/<%= name %>.test.ts
---
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@chromatic-com/playwright'
import { <%= h.changeCase.pascal(name) %>Page } from 'e2e/pageObjects/<%= name %>/<%= name %>Page'

test.describe('<%= name %>', () => {
  let client: ApolloClient<NormalizedCacheObject>
  let <%= name %>Page: <%= h.changeCase.pascal(name) %>Page

  test.beforeEach(({page}) => {
    <%= name %>Page = new <%= h.changeCase.pascal(name) %>Page(page)
  })

  test('should work', async () => {
    await <%= name %>Page.goTo('https://playwright.dev/')
  })
})
