import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'
import { Locator, Page } from '@playwright/test'
import { E2E_CONFIG, SINGLE_RUN_URL } from 'e2e/constants'

import { GetRunByIdQuery } from 'app/__generated__/graphql'
import { getRunById } from 'app/graphql/getRunById.server'

import { BasePage } from './basePage'

/** /runs/$id */
export class SingleRunPage extends BasePage {
  constructor(
    playwrightPage: Page,
    private readonly client: ApolloClient<NormalizedCacheObject>,
  ) {
    super(playwrightPage)
  }

  goToPage(): Promise<void> {
    return this.goTo(SINGLE_RUN_URL)
  }

  loadData(): Promise<ApolloQueryResult<GetRunByIdQuery>> {
    return getRunById({
      client: this.client,
      id: Number(E2E_CONFIG.runId),
      annotationsPage: 1,
    })
  }

  getPrimaryViewTomogramButton(): Locator {
    return this.page.locator('a:has-text("View Tomogram")')
  }

  findProcessingMethodsCell(): Locator {
    return this.page
      .locator(`td:has-text("Tomogram Processing")`)
      .locator('+ td')
  }

  findAnnotatedObjectsCell(): Locator {
    return this.page.locator(`td:has-text("Annotated Objects")`).locator('+ td')
  }

  async findAnnotatedObjectsTexts(): Promise<Array<string>> {
    return (await this.findAnnotatedObjectsCell().textContent())!.split(',')
  }

  findAnnotatedObjectsCollapseToggle(): Locator {
    return this.findAnnotatedObjectsCell().locator('svg')
  }
}
