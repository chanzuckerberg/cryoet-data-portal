import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { expect, test } from '@playwright/test'

import { getRunById } from 'app/graphql/getRunById.server'

import { getApolloClient } from './apollo'
import { E2E_CONFIG } from './constants'
import { NeuroglancerPage } from './pageObjects/neuroglancerPage'
import { SingleRunPage } from './pageObjects/singleRunPage'

test.describe('Single run page: ', () => {
  let client: ApolloClient<NormalizedCacheObject>
  let page: SingleRunPage
  let neuroglancerPage: NeuroglancerPage
  test.beforeEach(async ({ page: playwrightPage }) => {
    client = getApolloClient()
    page = new SingleRunPage(playwrightPage)
    neuroglancerPage = new NeuroglancerPage(playwrightPage)
    await page.goToPage()
  })

  /** This test ensures that the test after it is not a false negative. */
  test('Invalid Neuroglancer URL results in error on Neuroglancer page', async () => {
    await page.goTo(
      (await page.getPrimaryViewTomogramButton().getAttribute('href'))!.replace(
        '#!',
        "#!'",
      ),
    )

    await expect(neuroglancerPage.findViewer()).toBeVisible()
    await expect(neuroglancerPage.findErrorText()).toHaveCount(1)
  })

  test('Neuroglancer URL does not result in error on Neuroglancer page', async () => {
    await page.goTo(
      (await page.getPrimaryViewTomogramButton().getAttribute('href'))!,
    )

    await expect(neuroglancerPage.findViewer()).toBeVisible()
    await expect(neuroglancerPage.findErrorText()).toHaveCount(0)
  })

  test('Annotated Objects collapse after 7 items', async () => {
    const response = Array.from(
      new Set(
        (
          await getRunById({
            client,
            id: Number(E2E_CONFIG.runId),
            annotationsPage: 1,
          })
        ).data.runs[0].tomogram_stats
          .flatMap((tomogramVoxelSpacing) => tomogramVoxelSpacing.annotations)
          .map((annotation) => annotation.object_name),
      ),
    )

    if (response.length > 7) {
      // Collapsed:
      expect((await page.findAnnotatedObjectsTexts()).length).toBe(6)
      await expect(
        page
          .findAnnotatedObjectsCell()
          .locator(
            `:has-text("Show ${
              response.length - (await page.findAnnotatedObjectsTexts()).length
            } more")`,
          ),
      ).toBeVisible()

      await page.findAnnotatedObjectsCollapseToggle().click()

      // Expanded:
      expect((await page.findAnnotatedObjectsTexts()).length).toBe(
        response.length,
      )
      await expect(
        page.findAnnotatedObjectsCell().locator('Show less'),
      ).toBeVisible()

      await page.findAnnotatedObjectsCollapseToggle().click()

      // Collapsed:
      expect((await page.findAnnotatedObjectsTexts()).length).toBe(6)
    } else {
      expect((await page.findAnnotatedObjectsTexts()).length).toBe(
        response.length,
      )
      await expect(page.findAnnotatedObjectsCollapseToggle()).toHaveCount(0)
    }
  })
})
