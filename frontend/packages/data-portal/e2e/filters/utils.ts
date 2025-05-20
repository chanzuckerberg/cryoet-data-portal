// import { expect, Page, test } from '@playwright/test'
// import { E2E_CONFIG, translations } from 'e2e/constants'
// import { TableValidatorOptions } from 'e2e/pageObjects/filters/types'

import { Page } from '@playwright/test'

// import {
//   GetDatasetByIdQuery,
//   GetDatasetsDataQuery,
//   GetRunByIdQuery,
// } from 'app/__generated__/graphql'
// import { AVAILABLE_FILES_VALUE_TO_I18N_MAP } from 'app/components/DatasetFilter/constants'
// import { TestIds } from 'app/constants/testIds'
// import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'
// import { getDatasetById } from 'app/graphql/getDatasetById.server'
// import { getRunById } from 'app/graphql/getRunById.server'

// async function waitForTableCountChange({
//   countLabel,
//   expectedFilterCount,
//   expectedTotalCount,
//   page,
// }: {
//   countLabel: string
//   expectedFilterCount: number
//   expectedTotalCount: number
//   page: Page
// }) {
//   await page
//     .getByText(
//       new RegExp(
//         `^${expectedFilterCount} of ${expectedTotalCount} ${countLabel}$`,
//       ),
//     )
//     .waitFor()
// }

// /**
//  * Validator for testing filters on the dataset table. This works by checking if
//  * each row in the table has an existing dataset within the provided data. No
//  * additional data is tested in this function to keep tests fast and focused on
//  * testing the functionality of the filter.
//  */
// export function getDatasetTableFilterValidator(
//   expectedData: GetDatasetsDataQuery,
// ) {
//   const datasetIdSet = new Set(
//     expectedData.datasets.map((dataset) => dataset.id),
//   )

//   return async (page: Page) => {
//     const datasetIds = await Promise.all(
//       (await page.getByText(/Dataset ID: [0-9]+/).all()).map(async (node) => {
//         const text = await node.innerText()
//         return text.replace('Dataset ID: ', '')
//       }),
//     )

//     datasetIds.forEach((id) =>
//       expect(
//         datasetIdSet.has(+id),
//         `Check if dataset ${id} is found within available set: ${Array.from(
//           datasetIdSet,
//         ).join(', ')}`,
//       ).toBe(true),
//     )
//   }
// }

// export function getRunTableFilterValidator(expectedData: GetDatasetByIdQuery) {
//   const runIds = new Set(expectedData.datasets.at(0)?.runs.map((run) => run.id))

//   return async (page: Page) => {
//     const ids = await Promise.all(
//       (await page.getByText(/Run ID: [0-9]+/).all()).map(async (node) => {
//         const text = await node.innerText()
//         return text.replace('Run ID: ', '')
//       }),
//     )

//     ids.forEach((id) =>
//       expect(
//         runIds.has(+id),
//         `Check if run ${id} is found within available set: ${Array.from(
//           runIds,
//         ).join(', ')}`,
//       ).toBe(true),
//     )
//   }
// }

// export function getAnnotationTableFilterValidator(
//   expectedData: GetRunByIdQuery,
// ) {
//   const annotationIds = new Set(
//     expectedData.annotation_files.map((file) => file.annotation.id),
//   )

//   return async (page: Page) => {
//     const ids = await page.getByTestId(TestIds.AnnotationId).allInnerTexts()

//     ids.forEach((id) =>
//       expect(
//         annotationIds.has(+id),
//         `Check if annotation ${id} is found within available set: ${Array.from(
//           annotationIds,
//         ).join(', ')}`,
//       ).toBe(true),
//     )
//   }
// }

// export async function validateTable({
//   browseDatasetsData,
//   countLabel = translations.datasets,
//   page,
//   singleDatasetData,
//   singleRunData,
//   validateRows,
// }: {
//   browseDatasetsData?: GetDatasetsDataQuery
//   countLabel?: string
//   page: Page
//   singleDatasetData?: GetDatasetByIdQuery
//   singleRunData?: GetRunByIdQuery
//   validateRows(page: Page): Promise<void>
// }) {
//   const expectedFilterCount =
//     browseDatasetsData?.filtered_datasets_aggregate.aggregate?.count ??
//     singleDatasetData?.datasets.at(0)?.filtered_runs_count.aggregate?.count ??
//     singleRunData?.annotation_files_aggregate_for_filtered.aggregate?.count ??
//     0

//   const expectedTotalCount =
//     browseDatasetsData?.datasets_aggregate.aggregate?.count ??
//     singleDatasetData?.datasets.at(0)?.runs_aggregate.aggregate?.count ??
//     singleRunData?.annotation_files_aggregate_for_total.aggregate?.count ??
//     0

//   await waitForTableCountChange({
//     countLabel,
//     expectedFilterCount,
//     expectedTotalCount,
//     page,
//   })
//   await validateRows(page)
// }

/**
 * When loading the page, we need to wait a bit after so that the SDS components
 * have time to become interactive. Without the timeout, the tests become more
 * flaky and occasionally fail. For example, the filter dropdowns sometimes
 * don't open when clicked on because the playwright browser starts clicking on
 * it too fast while the JavaScript is still loading and hydrating.
 */
const TIME_UNTIL_INTERACTIVE = 3000

export async function waitForInteractive(page: Page) {
  // eslint-disable-next-line playwright/no-wait-for-timeout
  await page.waitForTimeout(TIME_UNTIL_INTERACTIVE)
}

export async function goTo(page: Page, url: string) {
  await page.goto(url)
  await waitForInteractive(page)
}

// export function skipClipboardTestsForWebkit(browserName: string) {
//   // eslint-disable-next-line playwright/no-skipped-test
//   test.skip(
//     browserName === 'webkit',
//     'Skipping for safari because clipboard permissions are not availabe.',
//   )
// }

// export async function validateDatasetsTable({
//   client,
//   page,
//   pageNumber,
//   params,
// }: TableValidatorOptions) {
//   const { data } = await getBrowseDatasets({
//     client,
//     params,
//     page: pageNumber,
//   })

//   await validateTable({
//     page,
//     browseDatasetsData: data,
//     validateRows: getDatasetTableFilterValidator(data),
//   })
// }

// export async function validateRunsTable({
//   client,
//   page,
//   params,
//   pageNumber,
//   id = +E2E_CONFIG.datasetId,
// }: TableValidatorOptions & { id?: number }) {
//   const { data } = await getDatasetById({
//     client,
//     params,
//     id,
//     page: pageNumber,
//   })

//   await validateTable({
//     page,
//     singleDatasetData: data,
//     validateRows: getRunTableFilterValidator(data),
//     countLabel: translations.runs,
//   })
// }

// export async function validateAnnotationsTable({
//   client,
//   page,
//   params,
//   pageNumber = 1,
//   id = +E2E_CONFIG.runId,
// }: TableValidatorOptions & { id?: number }) {
//   const { data } = await getRunById({
//     client,
//     params,
//     id,
//     annotationsPage: pageNumber,
//   })

//   await validateTable({
//     page,
//     singleRunData: data,
//     validateRows: getAnnotationTableFilterValidator(data),
//     countLabel: translations.annotations,
//   })
// }

// export const serializeAvailableFiles = (value: string): string => {
//   return (
//     Object.entries(AVAILABLE_FILES_VALUE_TO_I18N_MAP).find(
//       ([, i18nKey]) =>
//         translations[i18nKey as keyof typeof translations] === value,
//     )?.[0] ?? value
//   )
// }
