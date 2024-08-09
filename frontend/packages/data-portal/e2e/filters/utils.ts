import { Page } from '@playwright/test'

/**
 * When loading the page, we need to wait a bit after so that the SDS components
 * have time to become interactive. Without the timeout, the tests become more
 * flaky and occasionally fail. For example, the filter dropdowns sometimes
 * don't open when clicked on because the playwright browser starts clicking on
 * it too fast while the JavaScript is still loading and hydrating.
 */
const TIME_UNTIL_INTERACTIVE = 3000

export async function goTo(page: Page, url: string) {
  await page.goto(url)

  // eslint-disable-next-line playwright/no-wait-for-timeout
  await page.waitForTimeout(TIME_UNTIL_INTERACTIVE)
}
