// import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
// import { expect, test } from '@playwright/test'

// import { getApolloClient } from './apollo'
// import { NeuroglancerPage } from './pageObjects/neuroglancerPage'
// import { SingleRunPage } from './pageObjects/singleRunPage'

// test.describe('Single run page: ', () => {
//   let client: ApolloClient<NormalizedCacheObject>
//   let page: SingleRunPage
//   let neuroglancerPage: NeuroglancerPage

//   test.beforeEach(async ({ page: playwrightPage }) => {
//     client = getApolloClient()
//     page = new SingleRunPage(playwrightPage, client)
//     neuroglancerPage = new NeuroglancerPage(playwrightPage)

//     await page.goToPage()
//   })

//   /** This test ensures that the test after it is not a false negative. */
//   test('Invalid Neuroglancer URL results in error on Neuroglancer page', async () => {
//     await page.goTo(
//       (await page.getPrimaryViewTomogramButton().getAttribute('href'))!.replace(
//         '#!',
//         "#!'",
//       ),
//     )

//     await expect(neuroglancerPage.findViewer()).toBeVisible()
//     await expect(neuroglancerPage.findErrorText()).toHaveCount(1)
//   })

//   test('Neuroglancer URL does not result in error on Neuroglancer page', async () => {
//     await page.goTo(
//       (await page.getPrimaryViewTomogramButton().getAttribute('href'))!,
//     )

//     await expect(neuroglancerPage.findViewer()).toBeVisible()
//     await expect(neuroglancerPage.findErrorText()).toHaveCount(0)
//   })

//   test('Processing methods displayed', async () => {
//     const response = (
//       await page.loadData()
//     ).data.tomograms_for_distinct_processing_methods.map(
//       (tomogram) => tomogram.processing,
//     )

//     expect(
//       (await page.findProcessingMethodsCell().textContent())!
//         .toLowerCase()
//         .split(','),
//     ).toEqual(response)
//   })

//   test('Annotated Objects collapse after 7 items', async () => {
//     const response = (await page.loadData()).data.annotations_for_object_names

//     if (response.length > 7) {
//       // Collapsed:
//       expect((await page.findAnnotatedObjectsTexts()).length).toBe(6)
//       await expect(
//         page
//           .findAnnotatedObjectsCell()
//           .getByText(
//             `Show ${
//               response.length - (await page.findAnnotatedObjectsTexts()).length
//             } More`,
//           ),
//       ).toBeVisible()

//       await page.findAnnotatedObjectsCollapseToggle().click()

//       // Expanded:
//       expect((await page.findAnnotatedObjectsTexts()).length).toBe(
//         response.length,
//       )
//       await expect(
//         page.findAnnotatedObjectsCell().getByText('Show less'),
//       ).toBeVisible()

//       await page.findAnnotatedObjectsCollapseToggle().click()

//       // Collapsed:
//       expect((await page.findAnnotatedObjectsTexts()).length).toBe(6)
//     } else {
//       expect((await page.findAnnotatedObjectsTexts()).length).toBe(
//         response.length,
//       )
//       await expect(page.findAnnotatedObjectsCollapseToggle()).toHaveCount(0)
//     }
//   })
// })
