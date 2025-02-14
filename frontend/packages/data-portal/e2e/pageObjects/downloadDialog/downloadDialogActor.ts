// /**
//  * This file contains combinations of page interactions or data fetching. Remove if not needed.
//  */
// import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
// import { expect } from '@playwright/test'
// import { E2E_CONFIG, translations } from 'e2e/constants'
// import { DownloadDialogPage } from 'e2e/pageObjects/downloadDialog/downloadDialogPage'

// import {
//   getAllTomogramsCodeSnippet,
//   getDatasetCodeSnippet,
// } from 'app/components/Download/APIDownloadTab'
// import { getAwsCommand } from 'app/components/Download/AWSDownloadTab'
// import { DownloadConfig, DownloadStep, DownloadTab } from 'app/types/download'

// import {
//   constructDialogUrl,
//   fetchTestSingleDataset,
//   fetchTestSingleRun,
//   getAnnotationDownloadCommand,
//   getTomogramDownloadCommand,
// } from './utils'

// export class DownloadDialogActor {
//   private downloadDialogPage: DownloadDialogPage

//   constructor(downloadDialogPage: DownloadDialogPage) {
//     this.downloadDialogPage = downloadDialogPage
//   }

//   // #region Navigate
//   public async goToDownloadDialogUrl({
//     config,
//     fileFormat,
//     baseUrl,
//     step,
//     tab,
//     annotationFile,
//     tomogram,
//   }: {
//     config?: DownloadConfig
//     fileFormat?: string
//     baseUrl: string
//     step?: DownloadStep
//     tab?: DownloadTab
//     annotationFile?: { annotation: { id: string }; shape_type: string }
//     tomogram?: { id: number; sampling: number; processing: string }
//   }) {
//     const expectedUrl = constructDialogUrl(baseUrl, {
//       config,
//       fileFormat,
//       step,
//       tab,
//       annotationFile,
//       tomogram,
//     })
//     await this.downloadDialogPage.goTo(expectedUrl.href)
//   }

//   public async goToTomogramDownloadDialogUrl({
//     client,
//     config,
//     fileFormat,
//     baseUrl,
//     step,
//     tab,
//   }: {
//     client: ApolloClient<NormalizedCacheObject>
//     config?: DownloadConfig
//     fileFormat?: string
//     baseUrl: string
//     step?: DownloadStep
//     tab?: DownloadTab
//   }) {
//     const { data } = await fetchTestSingleRun(client)
//     const tomogram = data.tomograms[0]

//     await this.goToDownloadDialogUrl({
//       baseUrl,
//       config,
//       fileFormat,
//       step,
//       tab,
//       tomogram: {
//         id: tomogram.id,
//         sampling: tomogram.voxel_spacing,
//         processing: tomogram.processing,
//       },
//     })
//   }

//   public async goToAnnotationDownloadDialogUrl({
//     client,
//     baseUrl,
//     step,
//     tab,
//   }: {
//     client: ApolloClient<NormalizedCacheObject>
//     baseUrl: string
//     step?: DownloadStep
//     tab?: DownloadTab
//   }) {
//     const { data } = await fetchTestSingleRun(client)
//     const annotationFile = data.annotation_files[0]
//     const tomogram = data.tomograms[0]

//     await this.goToDownloadDialogUrl({
//       baseUrl,
//       fileFormat: annotationFile.format,
//       step,
//       tab,
//       annotationFile: {
//         annotation: {
//           id: annotationFile.annotation.id.toString(),
//         },
//         shape_type: annotationFile.shape_type,
//       },
//       tomogram: {
//         id: tomogram.id,
//         sampling: tomogram.voxel_spacing,
//         processing: tomogram.processing,
//       },
//     })
//   }
//   // #endregion Navigate

//   // #region Click
//   // #endregion Click

//   // #region Hover
//   // #endregion Hover

//   // #region Get
//   // #endregion Get

//   // #region Macro
//   // #endregion Macro

//   // #region Validation
//   public async expectDialogToBeOpen({
//     title,
//     substrings,
//   }: {
//     title: string
//     substrings?: string[]
//   }) {
//     const dialog = this.downloadDialogPage.getDialog()
//     await this.downloadDialogPage.expectDialogToBeVisible(dialog)
//     await this.downloadDialogPage.expectDialogToHaveTitle(dialog, title)
//     if (substrings) {
//       await Promise.all(
//         substrings.map(async (str) => {
//           await this.downloadDialogPage.expectSubstringToBeVisible(dialog, str)
//         }),
//       )
//     }
//   }

//   public async expectDownloadDatasetDialogToShowCorrectContent({
//     client,
//   }: {
//     client: ApolloClient<NormalizedCacheObject>
//   }) {
//     const { data } = await fetchTestSingleDataset(client)
//     await this.expectDialogToBeOpen({
//       title: translations.downloadOptions,
//       substrings: [`${translations.datasetName}: ${data.datasets[0].title}`],
//     })
//   }

//   public async expectDownloadRunStepOneToShowCorrectContent({
//     client,
//   }: {
//     client: ApolloClient<NormalizedCacheObject>
//   }) {
//     const { data } = await fetchTestSingleRun(client)
//     const runName = data.runs[0].name
//     const datasetName = data.runs[0].dataset.title
//     await this.expectDialogToBeOpen({
//       title: translations.configureDownload,
//       substrings: [
//         `${translations.datasetName}: ${datasetName}`,
//         `${translations.runName}: ${runName}`,
//       ],
//     })
//   }

//   public async expectDownloadRunStepTwoToShowCorrectContent({
//     client,
//   }: {
//     client: ApolloClient<NormalizedCacheObject>
//   }) {
//     const { data } = await fetchTestSingleRun(client)
//     const runName = data.runs[0].name
//     const datasetName = data.runs[0].dataset.title
//     await this.expectDialogToBeOpen({
//       title: translations.downloadOptions,
//       substrings: [
//         `${translations.datasetName}: ${datasetName}`,
//         `${translations.runName}: ${runName}`,
//         `${translations.annotations}: ${translations.all}`,
//       ],
//     })
//   }

//   public expectDialogUrlToMatch({
//     baseUrl,
//     config,
//     fileFormat,
//     tab,
//     tomogram,
//     step,
//   }: {
//     baseUrl: string
//     config?: string
//     fileFormat?: string
//     tab?: DownloadTab
//     annotationFile?: { annotation: { id: string }; shape_type: string }
//     tomogram?: { id: number; sampling: number; processing: string }
//     step?: DownloadStep
//   }) {
//     const expectedUrl = constructDialogUrl(baseUrl, {
//       config,
//       fileFormat,
//       tab,
//       tomogram,
//       step,
//     })
//     const actualUrl = new URL(this.downloadDialogPage.url())
//     expect(actualUrl.pathname).toBe(expectedUrl.pathname)
//     expect(actualUrl.searchParams.sort()).toBe(expectedUrl.searchParams.sort())
//   }

//   public async expectTomogramDialogUrlToMatch({
//     baseUrl,
//     client,
//     config,
//     fileFormat,
//     tab,
//     step,
//   }: {
//     baseUrl: string
//     client: ApolloClient<NormalizedCacheObject>
//     config?: string
//     fileFormat?: string
//     tab?: DownloadTab
//     step?: DownloadStep
//   }) {
//     const { data } = await fetchTestSingleRun(client)
//     const tomogram = data.tomograms[0]

//     this.expectDialogUrlToMatch({
//       baseUrl,
//       config,
//       fileFormat,
//       tab,
//       tomogram: {
//         id: tomogram.id,
//         sampling: tomogram.voxel_spacing,
//         processing: tomogram.processing,
//       },
//       step,
//     })
//   }

//   public async expectAnnotationDialogUrlToMatch({
//     baseUrl,
//     client,
//     config,
//     fileFormat,
//     tab,
//     step,
//   }: {
//     baseUrl: string
//     client: ApolloClient<NormalizedCacheObject>
//     config?: string
//     fileFormat?: string
//     tab?: DownloadTab
//     step?: DownloadStep
//   }) {
//     const { data } = await fetchTestSingleRun(client)
//     const annotationFile = data.annotation_files[0]
//     const tomogram = data.tomograms[0]

//     this.expectDialogUrlToMatch({
//       baseUrl,
//       config,
//       fileFormat,
//       tab,
//       annotationFile: {
//         annotation: {
//           id: annotationFile.annotation.id.toString(),
//         },
//         shape_type: annotationFile.shape_type,
//       },
//       tomogram: {
//         id: tomogram.id,
//         sampling: tomogram.voxel_spacing,
//         processing: tomogram.processing,
//       },
//       step,
//     })
//   }

//   public async expectDialogToBeOnCorrectTab({
//     tab,
//     tabGroup,
//   }: {
//     tab: DownloadTab
//     tabGroup: DownloadTab[]
//   }) {
//     const dialog = this.downloadDialogPage.getDialog()
//     await this.downloadDialogPage.expectTabSelected({
//       dialog,
//       tab,
//       isSelected: true,
//     })

//     await Promise.all(
//       tabGroup.map(async (t) => {
//         if (t !== tab) {
//           await this.downloadDialogPage.expectTabSelected({
//             dialog,
//             tab: t,
//             isSelected: false,
//           })
//         }
//       }),
//     )
//   }

//   public async expectClipboardToHaveAwsValue() {
//     const clipboard = await this.downloadDialogPage.getClipboardHandle()
//     const clipboardValue = await clipboard.jsonValue()
//     expect(clipboardValue).toContain('aws s3')
//     expect(clipboardValue).toContain(E2E_CONFIG.datasetId)
//   }

//   public async expectClipboardToHaveCorrectDownloadRunAnnotationsAwsCommand({
//     client,
//   }: {
//     client: ApolloClient<NormalizedCacheObject>
//   }) {
//     const clipboard = await this.downloadDialogPage.getClipboardHandle()
//     const clipboardValue = await clipboard.jsonValue()
//     const { data } = await fetchTestSingleRun(client)
//     const s3Prefix = `${data.runs[0].tomogram_voxel_spacings[0].s3_prefix}Annotations`
//     const expectedCommand = getAwsCommand({
//       s3Path: s3Prefix,
//       s3Command: 'sync',
//       isAllAnnotations: true,
//     })
//     expect(clipboardValue).toBe(expectedCommand)
//   }

//   public async expectClipboardToHaveCorrectDownloadTomogramCommand({
//     client,
//     fileFormat,
//     tab,
//   }: {
//     client: ApolloClient<NormalizedCacheObject>
//     fileFormat?: string
//     tab: DownloadTab
//   }) {
//     const clipboard = await this.downloadDialogPage.getClipboardHandle()
//     const clipboardValue = await clipboard.jsonValue()
//     const { data } = await fetchTestSingleRun(client)

//     const expectedCommand = getTomogramDownloadCommand({
//       data,
//       fileFormat,
//       tab,
//     })

//     expect(clipboardValue).toBe(expectedCommand)
//   }

//   public async expectClipboardToHaveCorrectDownloadAnnotationCommand({
//     client,
//     tab,
//   }: {
//     client: ApolloClient<NormalizedCacheObject>
//     tab: DownloadTab
//   }) {
//     const clipboard = await this.downloadDialogPage.getClipboardHandle()
//     const clipboardValue = await clipboard.jsonValue()
//     const { data } = await fetchTestSingleRun(client)

//     const expectedCommand = getAnnotationDownloadCommand({
//       data,
//       tab,
//     })

//     expect(clipboardValue).toBe(expectedCommand)
//   }

//   public async expectClipboardToHaveApiValue() {
//     const clipboard = await this.downloadDialogPage.getClipboardHandle()
//     const clipboardValue = await clipboard.jsonValue()
//     expect(clipboardValue).toBe(getDatasetCodeSnippet(+E2E_CONFIG.datasetId))
//   }

//   public async expectClipboardToHaveCorrectDownloadRunAnnotationsAPICommand({
//     client,
//   }: {
//     client: ApolloClient<NormalizedCacheObject>
//   }) {
//     const clipboard = await this.downloadDialogPage.getClipboardHandle()
//     const clipboardValue = await clipboard.jsonValue()

//     const { data } = await fetchTestSingleRun(client)
//     const runId = data.runs[0].id
//     const expectedCommand = getAllTomogramsCodeSnippet(runId)

//     expect(clipboardValue).toBe(expectedCommand)
//   }
//   // #endregion Validation
// }
