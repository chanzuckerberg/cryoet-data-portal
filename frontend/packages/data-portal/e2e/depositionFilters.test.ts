import { test } from '@playwright/test'

import { SINGLE_DEPOSITION_URL } from './constants'
import { goTo } from './filters/utils'
import { FiltersActor } from './pageObjects/filters/filtersActor'
import { FiltersPage } from './pageObjects/filters/filtersPage'

test.describe('Deposition page filters:', () => {
  let filtersPage: FiltersPage
  let filtersActor: FiltersActor

  test.beforeEach(async ({ page }) => {
    filtersPage = new FiltersPage(page)
    filtersActor = new FiltersActor(filtersPage)

    await goTo(page, SINGLE_DEPOSITION_URL)
  })

  test('Organism name filter renders', async () => {
    await filtersActor.addSingleSelectFilter({
      label: 'Organism Name',
      value: 'Homo sapiens',
    })
  })

  test('Object name filter renders', async () => {
    await filtersActor.addSingleSelectFilter({
      label: 'Object Name',
      value: 'vesicle',
    })
  })

  test('Shape type filter renders', async () => {
    await filtersActor.addSingleSelectFilter({
      label: 'Object Shape Type',
      value: 'Point',
    })
  })

  test('Camera manufacturer filter renders', async () => {
    await filtersActor.addSingleSelectFilter({
      label: 'Camera Manufacturer',
      value: 'Gatan',
    })
  })

  test('Reconstruction method filter renders', async () => {
    await filtersActor.addSingleSelectFilter({
      label: 'Reconstruction Method',
      value: 'WBP',
    })
  })

  test('Reconstruction software filter renders', async () => {
    await filtersActor.addSingleSelectFilter({
      label: 'Reconstruction Software',
      value: 'IMOD',
    })
  })

  // TODO: More tests.
})
