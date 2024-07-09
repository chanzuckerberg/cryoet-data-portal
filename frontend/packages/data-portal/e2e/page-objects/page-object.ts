import { Page } from '@playwright/test'

const TIME_UNTIL_INTERACTIVE = 3000

export abstract class PageObject {
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
    await this.page.goto(url)

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await this.page.waitForTimeout(TIME_UNTIL_INTERACTIVE)
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

  public async scrollToElement(
    locator: string,
    direction: 'up' | 'down',
    rowsLocator: string,
    indexAttribute: string,
  ) {
    const startTime = Date.now()
    const timeout = 30000
    const scrollAmount = direction === 'up' ? -500 : 500

    while (Date.now() - startTime < timeout) {
      const element = this.page.locator(locator).first()
      const isElementVisible = await element.isVisible()

      if (isElementVisible) {
        break
      }
      await this.page.locator(rowsLocator).last().hover()
      await this.page.locator(rowsLocator).last().focus()

      const lastRow = await this.page
        .locator(rowsLocator)
        .last()
        .getAttribute(indexAttribute)

      await this.page.mouse.wheel(0, scrollAmount)

      const lastRowAfterScroll = await this.page
        .locator(rowsLocator)
        .last()
        .getAttribute(indexAttribute)
      if (lastRow === lastRowAfterScroll) {
        // The list has not advanced, assume we reached the end of the list
        break
      }
    }
  }

  public async scrollUpToElement(
    locator: string,
    rowsLocator: string,
    indexAttribute: string,
  ) {
    await this.scrollToElement(locator, 'up', rowsLocator, indexAttribute)
  }

  public async scrollDownToElement(
    locator: string,
    rowsLocator: string,
    indexAttribute: string,
  ) {
    await this.scrollToElement(locator, 'down', rowsLocator, indexAttribute)
  }
}
