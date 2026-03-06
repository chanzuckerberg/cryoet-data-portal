import { takeSnapshot, test } from '@chromatic-com/playwright'

import { SingleRunPage } from './pageObjects/singleRunPage'

test.describe('Single run page: ', () => {
  let page: SingleRunPage

  test.beforeEach(async ({ page: playwrightPage }) => {
    page = new SingleRunPage(playwrightPage)

    await page.goToPage()
  })

  // TODO Implement E2E tests for new neuroglancer page
  // /** This test ensures that the test after it is not a false negative. */
  // test('Invalid Neuroglancer URL results in error on Neuroglancer page', async () => {
  //   await page.goTo(
  //     (await page.getPrimaryViewTomogramButton().getAttribute('href'))!.replace(
  //       '#!',
  //       "#!'",
  //     ),
  //   )

  //   await expect(neuroglancerPage.findViewer()).toBeVisible()
  //   await expect(neuroglancerPage.findErrorText()).toHaveCount(1)
  // })

  // test('Neuroglancer URL does not result in error on Neuroglancer page', async () => {
  //   await page.goTo(
  //     (await page.getPrimaryViewTomogramButton().getAttribute('href'))!,
  //   )

  //   await expect(neuroglancerPage.findViewer()).toBeVisible()
  //   await expect(neuroglancerPage.findErrorText()).toHaveCount(0)
  // })

  test('Processing methods displayed', async () => {})

  test('Annotated Objects collapse after 7 items', async ({
    page: playwrightPage,
  }, testInfo) => {
    const showMoreButton = page.findAnnotatedObjectsCollapseToggle()
    const isShowMoreVisible = await showMoreButton.isVisible()
    if (isShowMoreVisible) {
      await takeSnapshot(playwrightPage, 'before expanding', testInfo)
      await showMoreButton.click()
    }
  })
})
