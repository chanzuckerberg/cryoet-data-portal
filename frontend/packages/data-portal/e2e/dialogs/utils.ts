import { expect, Locator, Page } from '@playwright/test'

import { QueryParams } from 'app/constants/query'

export async function validateDialogOpen(
  page: Page,
  title: string,
  substrings?: string[],
): Promise<Locator> {
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading').first()).toHaveText(title)

  if (substrings) {
    await Promise.all(
      substrings.map(async (str) => {
        await expect(dialog.getByText(str)).toBeVisible()
      }),
    )
  }

  return dialog
}

export function getIconButton(loc: Locator) {
  return loc.locator('button:has(svg)')
}

export function constructDialogUrl(
  url: URL | string,
  {
    tab,
    step,
    config,
    tomogram,
    fileFormat,
  }: {
    tab?: string
    step?: string
    config?: string
    tomogram?: { sampling: number; processing: string }
    fileFormat?: string
  },
): URL {
  const expectedUrl = new URL(url)
  const params = expectedUrl.searchParams

  if (step) {
    params.append(QueryParams.DownloadStep, step)
  }

  if (config) {
    params.append(QueryParams.DownloadConfig, config)
  }

  if (tomogram) {
    params.append(QueryParams.TomogramSampling, String(tomogram.sampling))
    params.append(QueryParams.TomogramProcessing, tomogram.processing)
  }

  if (tab) {
    params.append(QueryParams.DownloadTab, tab)
  }

  if (fileFormat) {
    params.append(QueryParams.FileFormat, fileFormat)
  }

  return expectedUrl
}

export function expectUrlsToMatch(urlStr1: string, urlStr2: string) {
  const url1 = new URL(urlStr1)
  const url2 = new URL(urlStr2)

  expect(url1.pathname).toBe(url2.pathname)

  url1.searchParams.forEach((value, key) =>
    expect(url2.searchParams.get(key)).toBe(value),
  )
}

export async function expectTabSelected(
  loc: Locator,
  tab: string,
  selected: boolean = true,
) {
  await expect(loc.getByRole('tab', { name: tab })).toHaveAttribute(
    'aria-selected',
    selected ? 'true' : 'false',
  )
}

export async function expectClickToSwitchTab(
  loc: Locator,
  fromTab: string,
  toTab: string,
) {
  await expectTabSelected(loc, fromTab)
  await expectTabSelected(loc, toTab, false)

  await loc.getByRole('tab', { name: toTab }).click()

  await expectTabSelected(loc, toTab)
  await expectTabSelected(loc, fromTab, false)
}
