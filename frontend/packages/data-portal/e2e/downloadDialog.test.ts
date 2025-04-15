import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { expect, test } from '@chromatic-com/playwright'
import { DownloadDialogPage } from 'e2e/pageObjects/downloadDialog/downloadDialogPage'

import { IdPrefix } from 'app/constants/idPrefixes'
import { DownloadConfig, DownloadStep, DownloadTab } from 'app/types/download'

import { getApolloClientV2 } from './apollo'
import { SINGLE_DATASET_URL, SINGLE_RUN_URL, translations } from './constants'
import { DownloadDialogActor } from './pageObjects/downloadDialog/downloadDialogActor'
import {
  ANNOTATION_NON_STANDARD_TOMOGRAM_DOWNLOAD_TABS,
  SINGLE_DATASET_DOWNLOAD_TABS,
  TOMOGRAM_DOWNLOAD_TABS,
} from './pageObjects/downloadDialog/types'
import {
  fetchTestSingleRun,
  skipClipboardTestsForWebkit,
} from './pageObjects/downloadDialog/utils'

test.describe('downloadDialog', () => {
  let client: ApolloClient<NormalizedCacheObject>
  let downloadDialogPage: DownloadDialogPage
  let downloadDialogActor: DownloadDialogActor

  test.beforeEach(({ page }) => {
    client = getApolloClientV2()
    downloadDialogPage = new DownloadDialogPage(page)
    downloadDialogActor = new DownloadDialogActor(downloadDialogPage)
  })

  test.describe('Single Dataset', () => {
    test('should open when clicking download button', async () => {
      await downloadDialogPage.goTo(SINGLE_DATASET_URL)
      await downloadDialogPage.openDialog(translations.downloadDataset)

      await downloadDialogActor.expectDialogToBeOpen({
        title: translations.downloadDatasetTitle,
      })
      downloadDialogActor.expectDialogUrlToMatch({
        baseUrl: SINGLE_DATASET_URL,
        tab: DownloadTab.AWS,
      })
    })

    test('should display correct content', async () => {
      await downloadDialogPage.goTo(SINGLE_DATASET_URL)
      await downloadDialogPage.openDialog(translations.downloadDataset)

      downloadDialogActor.expectDialogUrlToMatch({
        baseUrl: SINGLE_DATASET_URL,
        tab: DownloadTab.AWS,
      })
    })

    test.describe('AWS Tab', () => {
      test('should open tab via url', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_DATASET_URL,
          tab: DownloadTab.AWS,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadDatasetTitle,
        })
        await downloadDialogActor.expectDialogToBeOnCorrectTab({
          tab: DownloadTab.AWS,
          tabGroup: SINGLE_DATASET_DOWNLOAD_TABS,
        })
      })

      test('should open tab when clicking', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_DATASET_URL,
          tab: DownloadTab.API,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadDatasetTitle,
        })
        await downloadDialogPage.clickTab(DownloadTab.AWS)

        await downloadDialogActor.expectDialogToBeOnCorrectTab({
          tab: DownloadTab.AWS,
          tabGroup: SINGLE_DATASET_DOWNLOAD_TABS,
        })
        downloadDialogActor.expectDialogUrlToMatch({
          baseUrl: SINGLE_DATASET_URL,
          tab: DownloadTab.AWS,
        })
      })

      test('should copy from aws tab', async ({ browserName }) => {
        skipClipboardTestsForWebkit(browserName)

        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_DATASET_URL,
          tab: DownloadTab.AWS,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadDatasetTitle,
        })
        await downloadDialogPage.clickCopyButton()

        await downloadDialogActor.expectClipboardToHaveAwsValue()
      })

      test('should close dialog', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_DATASET_URL,
          tab: DownloadTab.AWS,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadDatasetTitle,
        })
        await downloadDialogPage.clickCloseButton()

        await downloadDialogPage.expectDialogToBeHidden()
      })
    })

    test.describe('API Tab', () => {
      test('should open api tab via url', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_DATASET_URL,
          tab: DownloadTab.API,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadDatasetTitle,
        })
        await downloadDialogActor.expectDialogToBeOnCorrectTab({
          tab: DownloadTab.API,
          tabGroup: SINGLE_DATASET_DOWNLOAD_TABS,
        })
      })

      test('should open api tab by clicking', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_DATASET_URL,
          tab: DownloadTab.AWS,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadDatasetTitle,
        })
        await downloadDialogPage.clickTab(DownloadTab.API)

        await downloadDialogActor.expectDialogToBeOnCorrectTab({
          tab: DownloadTab.API,
          tabGroup: SINGLE_DATASET_DOWNLOAD_TABS,
        })
        downloadDialogActor.expectDialogUrlToMatch({
          baseUrl: SINGLE_DATASET_URL,
          tab: DownloadTab.API,
        })
      })

      test('should copy from api tab', async ({ browserName }) => {
        skipClipboardTestsForWebkit(browserName)

        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_DATASET_URL,
          tab: DownloadTab.API,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadDatasetTitle,
        })
        await downloadDialogPage.clickCopyButton()

        await downloadDialogActor.expectClipboardToHaveApiValue()
      })
      test('should close dialog', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_DATASET_URL,
          tab: DownloadTab.API,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadDatasetTitle,
        })
        await downloadDialogPage.clickCloseButton()

        await downloadDialogPage.expectDialogToBeHidden()
      })
    })
  })

  test.describe('Single Run', () => {
    test('should open when clicking download button', async () => {
      await downloadDialogPage.goTo(SINGLE_RUN_URL)
      await downloadDialogPage.openDialog(translations.download)

      await downloadDialogActor.expectDialogToBeOpen({
        title: translations.configureDownload,
      })
      downloadDialogActor.expectDialogUrlToMatch({
        baseUrl: SINGLE_RUN_URL,
        step: DownloadStep.Configure,
      })
    })

    test('should open configure step from url', async () => {
      await downloadDialogActor.goToDownloadDialogUrl({
        baseUrl: SINGLE_RUN_URL,
        step: DownloadStep.Configure,
      })

      await downloadDialogActor.expectDialogToBeOpen({
        title: translations.configureDownload,
      })
    })

    test('should contain subfield data in step 1', async () => {
      await downloadDialogActor.goToDownloadDialogUrl({
        config: DownloadConfig.AllAnnotations,
        baseUrl: SINGLE_RUN_URL,
        step: DownloadStep.Configure,
      })
    })

    test('should close step 1 when x button clicked', async () => {
      await downloadDialogActor.goToDownloadDialogUrl({
        baseUrl: SINGLE_RUN_URL,
        step: DownloadStep.Configure,
      })
      await downloadDialogActor.expectDialogToBeOpen({
        title: translations.configureDownload,
      })
      await downloadDialogPage.clickXButton()

      await downloadDialogPage.expectDialogToBeHidden()
    })

    // TODO: test info box once expanding/collapsing is fixed

    test.describe('All Annotations', () => {
      test('should select on click', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Configure,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.configureDownload,
        })

        await downloadDialogPage.clickDialogRadio(
          translations.downloadAllAnnotations,
        )

        await downloadDialogPage.expectRadioToBeSelected(
          DownloadConfig.AllAnnotations,
        )

        downloadDialogActor.expectDialogUrlToMatch({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Configure,
          config: DownloadConfig.AllAnnotations,
        })
      })

      test('should select from url', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          config: DownloadConfig.AllAnnotations,
          step: DownloadStep.Configure,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.configureDownload,
        })

        await downloadDialogPage.expectRadioToBeSelected(
          DownloadConfig.AllAnnotations,
        )
      })

      test('should change selection on click', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          config: DownloadConfig.Tomogram,
          step: DownloadStep.Configure,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.configureDownload,
        })

        await downloadDialogPage.clickDialogRadio(
          translations.downloadAllAnnotations,
        )

        await downloadDialogPage.expectRadioToBeSelected(
          DownloadConfig.AllAnnotations,
        )
      })

      test('should go to next step on click', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          config: DownloadConfig.AllAnnotations,
          step: DownloadStep.Configure,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.configureDownload,
        })

        await downloadDialogPage.clickNextButton()

        downloadDialogActor.expectDialogUrlToMatch({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })
      })

      test('should go back on click', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })

        await downloadDialogPage.clickBackButton()

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.configureDownload,
        })

        downloadDialogActor.expectDialogUrlToMatch({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Configure,
          config: DownloadConfig.AllAnnotations,
        })
      })

      test('should open aws tab from url', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })
        await downloadDialogActor.expectDialogToBeOnCorrectTab({
          tab: DownloadTab.AWS,
          tabGroup: SINGLE_DATASET_DOWNLOAD_TABS,
        })
      })

      test('should open api tab from url', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.API,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })
        await downloadDialogActor.expectDialogToBeOnCorrectTab({
          tab: DownloadTab.API,
          tabGroup: SINGLE_DATASET_DOWNLOAD_TABS,
        })
      })

      test('should contain subfield data in step 2', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })
      })

      test('should change tabs from aws to api on click', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
          fileFormat: 'mrc',
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })

        await downloadDialogPage.clickTab(DownloadTab.API)

        await downloadDialogActor.expectDialogToBeOnCorrectTab({
          tab: DownloadTab.API,
          tabGroup: SINGLE_DATASET_DOWNLOAD_TABS,
        })
        downloadDialogActor.expectDialogUrlToMatch({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.API,
          fileFormat: 'mrc',
        })
      })

      test('should copy from aws tab', async ({ browserName }) => {
        skipClipboardTestsForWebkit(browserName)

        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })

        await downloadDialogPage.clickCopyButton()

        await downloadDialogActor.expectClipboardToHaveCorrectDownloadRunAnnotationsAwsCommand(
          { client },
        )
      })

      test('should copy from api tab', async ({ browserName }) => {
        skipClipboardTestsForWebkit(browserName)

        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.API,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })

        await downloadDialogPage.clickCopyButton()

        await downloadDialogActor.expectClipboardToHaveCorrectDownloadRunAnnotationsAPICommand(
          { client },
        )
      })

      test('should close step 2 when x button clicked', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })

        await downloadDialogPage.clickXButton()

        await downloadDialogPage.expectDialogToBeHidden()
      })

      test('should close step 2 when close button clicked', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Download,
          config: DownloadConfig.AllAnnotations,
          tab: DownloadTab.AWS,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })

        await downloadDialogPage.clickCloseButton()

        await downloadDialogPage.expectDialogToBeHidden()
      })
    })

    test.describe('Download Tomogram', () => {
      test('should select on click', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          step: DownloadStep.Configure,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.configureDownload,
        })

        await downloadDialogPage.clickDialogRadio(translations.downloadTomogram)

        await downloadDialogPage.expectRadioToBeSelected(
          DownloadConfig.Tomogram,
        )

        await downloadDialogActor.expectTomogramDialogUrlToMatch({
          baseUrl: SINGLE_RUN_URL,
          client,
          step: DownloadStep.Configure,
          config: DownloadConfig.Tomogram,
          fileFormat: 'mrc',
        })
      })

      test('should select from url', async () => {
        await downloadDialogActor.goToTomogramDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          client,
          config: DownloadConfig.Tomogram,
          step: DownloadStep.Configure,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.configureDownload,
        })

        await downloadDialogPage.expectRadioToBeSelected(
          DownloadConfig.Tomogram,
        )
      })

      test('should change selection on click', async () => {
        await downloadDialogActor.goToDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          config: DownloadConfig.AllAnnotations,
          step: DownloadStep.Configure,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.configureDownload,
        })

        await downloadDialogPage.clickDialogRadio(translations.downloadTomogram)

        await downloadDialogPage.expectRadioToBeSelected(
          DownloadConfig.Tomogram,
        )

        await downloadDialogActor.expectTomogramDialogUrlToMatch({
          baseUrl: SINGLE_RUN_URL,
          client,
          step: DownloadStep.Configure,
          config: DownloadConfig.Tomogram,
          fileFormat: 'mrc',
        })
      })

      test('should auto-select tomogram from row', async ({ page }) => {
        const lastTomogramId = (
          await fetchTestSingleRun(client)
        ).data.tomograms.at(-1)!.id
        await downloadDialogPage.goTo(SINGLE_RUN_URL)
        await page
          .locator(`button:has-text("${translations.tomograms}")`)
          .click()
        await page.locator('button:has-text("DOWNLOAD")').last().click()

        await expect(downloadDialogPage.getDialog()).toContainText(
          `Select Tomogram:${lastTomogramId} `,
        )

        await downloadDialogPage.clickNextButton()

        await expect(downloadDialogPage.getDialog()).toContainText(
          `Tomogram ID: ${IdPrefix.Tomogram}-${lastTomogramId}`,
        )
      })

      // TODO(bchu): Add tomogram selector test.

      test('should change file type', async () => {
        await downloadDialogPage.goTo(SINGLE_RUN_URL)
        await downloadDialogPage.openDialog(
          translations.downloadWithAdditionalOptions,
        )

        await expect(
          downloadDialogPage.getDialog().getByRole('radio', { checked: true }),
        ).toHaveCount(0)

        await downloadDialogPage.clickDialogRadio(translations.downloadTomogram)
        await downloadDialogPage.selectFileType('OME-ZARR')
        await downloadDialogPage.clickNextButton()

        await expect(downloadDialogPage.getDialog()).toContainText(
          /.*s3\s.*\.zarr\s.*/,
        )
      })

      test.describe('should open tabs from url', () => {
        TOMOGRAM_DOWNLOAD_TABS.forEach((tab) => {
          test(`should open ${tab} tab from url`, async () => {
            await downloadDialogActor.goToTomogramDownloadDialogUrl({
              baseUrl: SINGLE_RUN_URL,
              client,
              config: DownloadConfig.Tomogram,
              step: DownloadStep.Download,
              fileFormat: 'mrc',
              tab,
            })

            await downloadDialogActor.expectDialogToBeOpen({
              title: translations.downloadOptions,
            })

            await downloadDialogActor.expectDialogToBeOnCorrectTab({
              tab,
              tabGroup: TOMOGRAM_DOWNLOAD_TABS,
            })
          })
        })
      })

      test.describe('should change tabs on click', () => {
        const testCases = TOMOGRAM_DOWNLOAD_TABS.flatMap((v1, i) =>
          TOMOGRAM_DOWNLOAD_TABS.toSpliced(i, 1).map((v2) => ({
            fromTab: v1,
            toTab: v2,
          })),
        )
        testCases.forEach(({ fromTab, toTab }) => {
          test(`should change from ${fromTab} to ${toTab} on click`, async () => {
            await downloadDialogActor.goToTomogramDownloadDialogUrl({
              baseUrl: SINGLE_RUN_URL,
              client,
              config: DownloadConfig.Tomogram,
              fileFormat: 'mrc',
              step: DownloadStep.Download,
              tab: fromTab,
            })

            await downloadDialogActor.expectDialogToBeOpen({
              title: translations.downloadOptions,
            })

            await downloadDialogPage.clickTab(toTab)

            await downloadDialogActor.expectDialogToBeOnCorrectTab({
              tab: toTab,
              tabGroup: TOMOGRAM_DOWNLOAD_TABS,
            })
            await downloadDialogActor.expectTomogramDialogUrlToMatch({
              baseUrl: SINGLE_RUN_URL,
              client,
              config: DownloadConfig.Tomogram,
              fileFormat: 'mrc',
              step: DownloadStep.Download,
              tab: toTab,
            })
          })
        })
      })

      test.describe('should copy from tabs', () => {
        const testCases = TOMOGRAM_DOWNLOAD_TABS.filter(
          (tab) => tab !== DownloadTab.Download,
        )

        testCases.forEach((tab) => {
          test(`should copy from ${tab} tab`, async ({ browserName }) => {
            skipClipboardTestsForWebkit(browserName)

            await downloadDialogActor.goToTomogramDownloadDialogUrl({
              baseUrl: SINGLE_RUN_URL,
              client,
              config: DownloadConfig.Tomogram,
              fileFormat: 'mrc',
              step: DownloadStep.Download,
              tab,
            })

            await downloadDialogActor.expectDialogToBeOpen({
              title: translations.downloadOptions,
            })

            await downloadDialogPage.clickCopyButton()

            await downloadDialogActor.expectClipboardToHaveCorrectDownloadTomogramCommand(
              { client, fileFormat: 'mrc', tab },
            )
          })
        })
      })

      test('should close when x button clicked', async () => {
        await downloadDialogActor.goToTomogramDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          client,
          config: DownloadConfig.Tomogram,
          fileFormat: 'mrc',
          step: DownloadStep.Download,
          tab: DownloadTab.AWS,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })

        await downloadDialogPage.clickXButton()

        await downloadDialogPage.expectDialogToBeHidden()
      })

      test('should close when close button clicked', async () => {
        await downloadDialogActor.goToTomogramDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          client,
          config: DownloadConfig.Tomogram,
          fileFormat: 'mrc',
          step: DownloadStep.Download,
          tab: DownloadTab.AWS,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })

        await downloadDialogPage.clickCloseButton()

        await downloadDialogPage.expectDialogToBeHidden()
      })
    })

    test.describe('Download Annotation', () => {
      test('should select from url', async () => {
        const fileFormat = 'mrc'
        await downloadDialogActor.goToAnnotationDownloadDialogUrl({
          baseUrl: SINGLE_RUN_URL,
          client,
          step: DownloadStep.Configure,
          fileFormat,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.configureDownload,
        })
        await expect(downloadDialogPage.getDialog()).toContainText(fileFormat)
      })

      test.describe('should open tabs from url', () => {
        ANNOTATION_NON_STANDARD_TOMOGRAM_DOWNLOAD_TABS.forEach((tab) => {
          test(`should open ${tab} tab from url`, async () => {
            await downloadDialogActor.goToAnnotationDownloadDialogUrl({
              baseUrl: SINGLE_RUN_URL,
              client,
              step: DownloadStep.Download,
              tab,
              fileFormat: 'mrc',
            })

            await downloadDialogActor.expectDialogToBeOpen({
              title: translations.downloadOptions,
            })

            await downloadDialogActor.expectDialogToBeOnCorrectTab({
              tab,
              tabGroup: ANNOTATION_NON_STANDARD_TOMOGRAM_DOWNLOAD_TABS,
            })
          })
        })
      })

      test.describe('should change tabs on click', () => {
        const testCases =
          ANNOTATION_NON_STANDARD_TOMOGRAM_DOWNLOAD_TABS.flatMap((v1, i) =>
            ANNOTATION_NON_STANDARD_TOMOGRAM_DOWNLOAD_TABS.toSpliced(i, 1).map(
              (v2) => ({
                fromTab: v1,
                toTab: v2,
              }),
            ),
          )
        testCases.forEach(({ fromTab, toTab }) => {
          test(`should change from ${fromTab} to ${toTab} on click`, async () => {
            await downloadDialogActor.goToAnnotationDownloadDialogUrl({
              baseUrl: SINGLE_RUN_URL,
              client,
              step: DownloadStep.Download,
              tab: fromTab,
              fileFormat: 'mrc',
            })

            await downloadDialogActor.expectDialogToBeOpen({
              title: translations.downloadOptions,
            })

            await downloadDialogPage.clickTab(toTab)

            await downloadDialogActor.expectDialogToBeOnCorrectTab({
              tab: toTab,
              tabGroup: ANNOTATION_NON_STANDARD_TOMOGRAM_DOWNLOAD_TABS,
            })
            await downloadDialogActor.expectAnnotationDialogUrlToMatch({
              baseUrl: SINGLE_RUN_URL,
              client,
              step: DownloadStep.Download,
              tab: toTab,
            })
          })
        })
      })

      test.describe('should copy from tabs', () => {
        const testCases = ANNOTATION_NON_STANDARD_TOMOGRAM_DOWNLOAD_TABS.filter(
          (tab) => tab !== DownloadTab.Download,
        )

        testCases.forEach((tab) => {
          test(`should copy from ${tab} tab`, async ({ browserName }) => {
            skipClipboardTestsForWebkit(browserName)

            await downloadDialogActor.goToAnnotationDownloadDialogUrl({
              baseUrl: SINGLE_RUN_URL,
              client,
              step: DownloadStep.Download,
              tab,
              fileFormat: 'mrc',
            })

            await downloadDialogActor.expectDialogToBeOpen({
              title: translations.downloadOptions,
            })

            await downloadDialogPage.clickCopyButton()

            await downloadDialogActor.expectClipboardToHaveCorrectDownloadAnnotationCommand(
              { client, tab },
            )
          })
        })
      })
    })
  })
})
