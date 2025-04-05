import { Page } from '@playwright/test'
import { goTo, waitForInteractive } from 'e2e/filters/utils'

// import { goTo, waitForInteractive } from 'e2e/filters/utils'
import { QueryParams } from 'app/constants/query'

export abstract class BasePage {
  public page: Page
  // TODO: (ehoops) can we move getApolloClient to a method here?

  public baseUrl: string

  constructor(page: Page) {
    this.page = page
    this.baseUrl = process.env.BASEURL || 'http://localhost:8080'
  }

  // #region Navigate
  /**
   * When loading the page, we need to wait a bit after so that the SDS components
   * have time to become interactive. Without the timeout, the tests become more
   * flaky and occasionally fail. For example, the filter dropdowns sometimes
   * don't open when clicked on because the playwright browser starts clicking on
   * it too fast while the JavaScript is still loading and hydrating.
   */

  public async goTo(url: string) {
    await goTo(this.page, url)
  }

  /**
   * Wait for page to become interactive. Useful for waiting for the page to
   * become interactive after a navigation within the UI.
   */
  public async waitForInteractive() {
    await waitForInteractive(this.page)
  }

  // #endregion Navigate

  // #region Keyboard
  public async pressEscape() {
    await this.page.keyboard.press('Escape')
  }

  public async pressEnter() {
    await this.page.keyboard.press('Enter')
  }
  // #endregion Keyboard

  // #region Get
  public getLocator(locatorString: string) {
    return this.page.locator(locatorString)
  }
  // #endregion Get

  // #region Click
  public async clickElement(locatorString: string) {
    await this.getLocator(locatorString).click()
  }
  // #endregion Click

  public async close() {
    await this.page.close()
  }

  public url() {
    return this.page.url()
  }

  public async reload() {
    await this.page.reload()
  }

  // NOTE: We should avoid using this method as much as possible. It's better to use
  // the specific methods here: https://github.com/playwright-community/eslint-plugin-playwright/blob/main/docs/rules/no-wait-for-timeout.md
  public async pause(seconds: number) {
    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(seconds * 1000)
  }

  public getUrlWithParamSelector(
    param: QueryParams | null | undefined,
    value: string | null | undefined,
  ) {
    if (!param || !value) {
      return 'a'
    }

    return `a[href*="${new URLSearchParams([[param, value]]).toString()}"]`
  }
}
