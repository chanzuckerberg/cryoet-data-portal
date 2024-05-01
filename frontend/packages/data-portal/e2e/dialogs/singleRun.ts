import { expect, test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { goTo, skipClipboardTestsForWebkit } from 'e2e/filters/utils'

import { getAwsCommand } from 'app/components/Download/AWSDownloadTab'
import { getCurlCommand } from 'app/components/Download/CurlDownloadTab'
import { getRunById } from 'app/graphql/getRunById.server'
import { DownloadConfig, DownloadStep, DownloadTab } from 'app/types/download'

import { E2E_CONFIG, SINGLE_RUN_URL, translations } from '../constants'
import {
  constructDialogUrl,
  expectClickToSwitchTab,
  expectTabSelected,
  expectUrlsToMatch,
  getIconButton,
  validateDialogOpen,
} from './utils'

const TOMOTABS = [
  DownloadTab.API,
  DownloadTab.AWS,
  DownloadTab.Curl,
  DownloadTab.Download,
]

async function fetchData() {
  const client = getApolloClient()
  return getRunById({ client, id: +E2E_CONFIG.runId })
}

export function testSingleRunDownloadDialog() {
  test.describe('Single Run', () => {
    test('should open when clicking download button', async ({ page }) => {
      await goTo(page, SINGLE_RUN_URL)
      await page
        .getByRole('button', { name: translations.download })
        .first()
        .click()

      await validateDialogOpen(page, translations.configureDownload)
      const expectedUrl = constructDialogUrl(SINGLE_RUN_URL, {
        step: DownloadStep.Configure,
      })
      await page.waitForURL(expectedUrl.href)
    })

    test('should open configure step from url', async ({ page }) => {
      const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
        step: DownloadStep.Configure,
      })
      await goTo(page, initialUrl.href)
      await validateDialogOpen(page, translations.configureDownload)
    })

    test('should contain subfield data in step 1', async ({ page }) => {
      const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
        step: DownloadStep.Configure,
        config: DownloadConfig.AllAnnotations,
      })
      const { data } = await fetchData()
      const runName = data.runs[0].name
      const datasetName = data.runs[0].dataset.title

      await goTo(page, initialUrl.href)
      await validateDialogOpen(page, translations.configureDownload, [
        `${translations.dataset}: ${datasetName}`,
        `${translations.run}: ${runName}`,
      ])
    })

    test('should close step 1 when x button clicked', async ({ page }) => {
      const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
        step: DownloadStep.Configure,
        config: DownloadConfig.AllAnnotations,
      })
      await goTo(page, initialUrl.href)
      const dialog = await validateDialogOpen(
        page,
        translations.configureDownload,
      )

      await getIconButton(dialog).first().click()
      await expect(dialog).toBeHidden()
    })

    // TODO: test info box once expanding/collapsing is fixed

    test.describe('Download All Annotations', () => {
      test('should select on click', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.configureDownload,
        )

        await dialog
          .getByRole('button', { name: translations.downloadAllAnnotations })
          .click()

        await expect(dialog.getByRole('radio', { checked: true })).toHaveValue(
          DownloadConfig.AllAnnotations,
        )

        const expectedUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
          config: DownloadConfig.AllAnnotations,
        })
        await page.waitForURL(expectedUrl.href)
      })

      test('should select from url', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
          config: DownloadConfig.AllAnnotations,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.configureDownload,
        )

        await expect(dialog.getByRole('radio', { checked: true })).toHaveValue(
          DownloadConfig.AllAnnotations,
        )
      })

      test('should change selection on click', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
          config: DownloadConfig.Tomogram,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.configureDownload,
        )

        await expect(dialog.getByRole('radio', { checked: true })).toHaveValue(
          DownloadConfig.Tomogram,
        )

        await dialog
          .getByRole('button', { name: translations.downloadAllAnnotations })
          .click()

        await expect(dialog.getByRole('radio', { checked: true })).toHaveValue(
          DownloadConfig.AllAnnotations,
        )

        const expectedUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
          config: DownloadConfig.AllAnnotations,
        })

        await page.waitForURL(expectedUrl.href)
      })

      test('should go to next step on click', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
          config: DownloadConfig.AllAnnotations,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.configureDownload,
        )

        await dialog.getByRole('button', { name: translations.next }).click()

        await validateDialogOpen(page, translations.downloadOptions)

        const expectedUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })
        await page.waitForURL(expectedUrl.href)
      })

      test('should go back on click', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await dialog.getByRole('button', { name: translations.back }).click()

        await validateDialogOpen(page, translations.configureDownload)

        const expectedUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
          config: DownloadConfig.AllAnnotations,
        })
        await page.waitForURL(expectedUrl.href)
      })

      test('should open aws tab from url', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await expectTabSelected(dialog, DownloadTab.AWS)
        await expectTabSelected(dialog, DownloadTab.API, false)
      })

      test('should open api tab from url', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.API,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await expectTabSelected(dialog, DownloadTab.API)
        await expectTabSelected(dialog, DownloadTab.AWS, false)
      })

      test('should contain subfield data in step 2', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })
        const { data } = await fetchData()
        const runName = data.runs[0].name
        const datasetName = data.runs[0].dataset.title

        await goTo(page, initialUrl.href)
        await validateDialogOpen(page, translations.downloadOptions, [
          `${translations.dataset}: ${datasetName}`,
          `${translations.run}: ${runName}`,
          `${translations.annotations}: ${translations.all}`,
        ])
      })

      test('should change tabs from aws to api on click', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
          fileFormat: 'mrc',
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await expectClickToSwitchTab(dialog, DownloadTab.AWS, DownloadTab.API)

        const expectedUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.API,
          fileFormat: 'mrc',
        })

        expectUrlsToMatch(page.url(), expectedUrl.href)
      })

      test('should change tabs from api to aws on click', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.API,
          fileFormat: 'mrc',
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await expectClickToSwitchTab(dialog, DownloadTab.API, DownloadTab.AWS)

        const expectedUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
          fileFormat: 'mrc',
        })

        expectUrlsToMatch(page.url(), expectedUrl.href)
      })

      test('should copy from aws tab', async ({ page, browserName }) => {
        skipClipboardTestsForWebkit(browserName)

        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })
        await goTo(page, initialUrl.href)

        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await dialog.getByRole('button', { name: translations.copy }).click()

        const handle = await page.evaluateHandle(() =>
          navigator.clipboard.readText(),
        )
        const clipboardValue = await handle.jsonValue()

        const { data } = await fetchData()
        const s3Prefix = `${data.runs[0].tomogram_voxel_spacings[0].s3_prefix}Annotations`

        expect(clipboardValue).toBe(
          getAwsCommand({ s3Path: s3Prefix, s3Command: 'sync' }),
        )
      })

      test('should copy from api tab', async ({ page, browserName }) => {
        skipClipboardTestsForWebkit(browserName)

        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.API,
        })
        await goTo(page, initialUrl.href)

        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await dialog.getByRole('button', { name: translations.copy }).click()

        const handle = await page.evaluateHandle(() =>
          navigator.clipboard.readText(),
        )
        const clipboardValue = await handle.jsonValue()

        const { data } = await fetchData()
        const voxelSpacingId = data.runs[0].tomogram_voxel_spacings[0].id

        expect(clipboardValue).toBe(String(voxelSpacingId))
      })

      test('should close step 2 when x button clicked', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await getIconButton(dialog).first().click()
        await expect(dialog).toBeHidden()
      })

      test('should close step 2 when close button clicked', async ({
        page,
      }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await dialog.getByRole('button', { name: translations.close }).click()
        await expect(dialog).toBeHidden()
      })
    })

    test.describe('Download Tomogram', () => {
      test('should select on click', async ({ page }) => {
        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.configureDownload,
        )

        const { data } = await fetchData()
        const tomogram = data.runs[0].tomogram_voxel_spacings[0].tomograms[0]

        await dialog
          .getByRole('button', { name: translations.downloadTomogram })
          .click()

        await expect(dialog.getByRole('radio', { checked: true })).toHaveValue(
          DownloadConfig.Tomogram,
        )

        const expectedUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
          config: DownloadConfig.Tomogram,
          tomogram: {
            sampling: tomogram.voxel_spacing,
            processing: tomogram.processing,
          },
          fileFormat: 'mrc',
        })
        await page.waitForURL(expectedUrl.href)
      })

      // TODO: when we support multiple tomograms per run add tests for the different dropdowns

      test('should select from url', async ({ page }) => {
        const { data } = await fetchData()
        const tomogram = data.runs[0].tomogram_voxel_spacings[0].tomograms[0]

        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
          config: DownloadConfig.Tomogram,
          tomogram: {
            sampling: tomogram.voxel_spacing,
            processing: tomogram.processing,
          },
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.configureDownload,
        )

        await expect(dialog.getByRole('radio', { checked: true })).toHaveValue(
          DownloadConfig.Tomogram,
        )
      })

      test('should change selection on click', async ({ page }) => {
        const { data } = await fetchData()
        const tomogram = data.runs[0].tomogram_voxel_spacings[0].tomograms[0]

        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
          config: DownloadConfig.AllAnnotations,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.configureDownload,
        )

        await expect(dialog.getByRole('radio', { checked: true })).toHaveValue(
          DownloadConfig.AllAnnotations,
        )

        await dialog
          .getByRole('button', { name: translations.downloadTomogram })
          .click()

        await expect(dialog.getByRole('radio', { checked: true })).toHaveValue(
          DownloadConfig.Tomogram,
        )

        const expectedUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Configure,
          config: DownloadConfig.Tomogram,
          tomogram: {
            sampling: tomogram.voxel_spacing,
            processing: tomogram.processing,
          },
          fileFormat: 'mrc',
        })
        await page.waitForURL(expectedUrl.href)
      })

      test.describe('should open tabs from url', () => {
        TOMOTABS.forEach((tab, i) => {
          test(`should open ${tab} tab from url`, async ({ page }) => {
            const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
              step: DownloadStep.Download,
              config: DownloadConfig.Tomogram,
              fileFormat: 'mrc',
              tab,
            })

            await goTo(page, initialUrl.href)
            const dialog = await validateDialogOpen(
              page,
              translations.downloadOptions,
            )

            await expectTabSelected(dialog, tab)
            await Promise.all(
              TOMOTABS.toSpliced(i, 1).map(async (t) => {
                await expectTabSelected(dialog, t, false)
              }),
            )
          })
        })
      })

      test.describe('should change tabs on click', () => {
        const testCases = TOMOTABS.flatMap((v1, i) =>
          TOMOTABS.toSpliced(i, 1).map((v2) => ({ fromTab: v1, toTab: v2 })),
        )

        testCases.forEach(({ fromTab, toTab }) => {
          test(`should change tabs from ${fromTab} to ${toTab}`, async ({
            page,
          }) => {
            const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
              step: DownloadStep.Download,
              config: DownloadConfig.Tomogram,
              tab: fromTab,
              fileFormat: 'mrc',
            })
            await goTo(page, initialUrl.href)
            const dialog = await validateDialogOpen(
              page,
              translations.downloadOptions,
            )

            await expectClickToSwitchTab(dialog, fromTab, toTab)

            const expectedUrl = constructDialogUrl(SINGLE_RUN_URL, {
              step: DownloadStep.Download,
              config: DownloadConfig.Tomogram,
              tab: toTab,
              fileFormat: 'mrc',
            })

            expectUrlsToMatch(page.url(), expectedUrl.href)
          })
        })
      })

      test('should copy from aws tab', async ({ page, browserName }) => {
        skipClipboardTestsForWebkit(browserName)

        const { data } = await fetchData()
        const tomogram = data.runs[0].tomogram_voxel_spacings[0].tomograms[0]
        const activeTomogram =
          data.runs[0].tomogram_stats[0].tomogram_resolutions.find((tomo) => {
            return (
              tomo.voxel_spacing === tomogram.voxel_spacing &&
              tomo.processing === tomogram.processing
            )
          })

        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.Tomogram,
          tomogram: {
            sampling: tomogram.voxel_spacing,
            processing: tomogram.processing,
          },
          tab: DownloadTab.AWS,
          fileFormat: 'mrc',
        })
        await goTo(page, initialUrl.href)

        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await dialog.getByRole('button', { name: translations.copy }).click()

        const handle = await page.evaluateHandle(() =>
          navigator.clipboard.readText(),
        )
        const clipboardValue = await handle.jsonValue()

        const s3Prefix = activeTomogram?.s3_mrc_scale0

        expect(clipboardValue).toBe(
          getAwsCommand({ s3Path: s3Prefix, s3Command: 'cp' }),
        )
      })

      test('should copy from api tab', async ({ page, browserName }) => {
        skipClipboardTestsForWebkit(browserName)

        const { data } = await fetchData()
        const tomogram = data.runs[0].tomogram_voxel_spacings[0].tomograms[0]
        const activeTomogram =
          data.runs[0].tomogram_stats[0].tomogram_resolutions.find((tomo) => {
            return (
              tomo.voxel_spacing === tomogram.voxel_spacing &&
              tomo.processing === tomogram.processing
            )
          })

        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.Tomogram,
          tomogram: {
            sampling: tomogram.voxel_spacing,
            processing: tomogram.processing,
          },
          tab: DownloadTab.API,
        })
        await goTo(page, initialUrl.href)

        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await dialog.getByRole('button', { name: translations.copy }).click()

        const handle = await page.evaluateHandle(() =>
          navigator.clipboard.readText(),
        )
        const clipboardValue = await handle.jsonValue()

        expect(clipboardValue).toBe(String(activeTomogram?.id))
      })

      test('should copy from curl tab', async ({ page, browserName }) => {
        skipClipboardTestsForWebkit(browserName)

        const { data } = await fetchData()
        const tomogram = data.runs[0].tomogram_voxel_spacings[0].tomograms[0]
        const activeTomogram =
          data.runs[0].tomogram_stats[0].tomogram_resolutions.find((tomo) => {
            return (
              tomo.voxel_spacing === tomogram.voxel_spacing &&
              tomo.processing === tomogram.processing
            )
          })

        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.Tomogram,
          tomogram: {
            sampling: tomogram.voxel_spacing,
            processing: tomogram.processing,
          },
          tab: DownloadTab.Curl,
        })
        await goTo(page, initialUrl.href)

        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await dialog.getByRole('button', { name: translations.copy }).click()

        const handle = await page.evaluateHandle(() =>
          navigator.clipboard.readText(),
        )
        const clipboardValue = await handle.jsonValue()

        expect(clipboardValue).toBe(
          getCurlCommand(activeTomogram?.https_mrc_scale0),
        )
      })

      test('should close when x clicked', async ({ page }) => {
        const { data } = await fetchData()
        const tomogram = data.runs[0].tomogram_voxel_spacings[0].tomograms[0]

        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.Tomogram,
          tomogram: {
            sampling: tomogram.voxel_spacing,
            processing: tomogram.processing,
          },
          tab: DownloadTab.AWS,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await getIconButton(dialog).click()
        await expect(dialog).toBeHidden()
      })

      test('should close when close button clicked', async ({ page }) => {
        const { data } = await fetchData()
        const tomogram = data.runs[0].tomogram_voxel_spacings[0].tomograms[0]

        const initialUrl = constructDialogUrl(SINGLE_RUN_URL, {
          step: DownloadStep.Download,
          config: DownloadConfig.Tomogram,
          tomogram: {
            sampling: tomogram.voxel_spacing,
            processing: tomogram.processing,
          },
          tab: DownloadTab.AWS,
        })
        await goTo(page, initialUrl.href)
        const dialog = await validateDialogOpen(
          page,
          translations.downloadOptions,
        )

        await dialog.getByRole('button', { name: translations.close }).click()
        await expect(dialog).toBeHidden()
      })
    })
  })
}
