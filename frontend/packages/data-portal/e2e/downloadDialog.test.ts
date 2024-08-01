import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { DownloadDialogPage } from 'e2e/pageObjects/downloadDialog/downloadDialogPage'

test.describe('Single Dataset download dialog', () => {
  let client: ApolloClient<NormalizedCacheObject>
  let downloadDialogPage: DownloadDialogPage

  test.beforeEach(({ page }) => {
    downloadDialogPage = new DownloadDialogPage(page)
  })

  test('should open when clicking download button', async () => {
    await downloadDialogPage.goTo('https://playwright.dev/')
  })
})
