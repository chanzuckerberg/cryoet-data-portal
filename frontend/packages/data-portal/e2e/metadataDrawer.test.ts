import { getDatasetById } from 'app/graphql/getDatasetById.server'
import { getRunById } from 'app/graphql/getRunById.server'

import {
  E2E_CONFIG,
  SINGLE_DATASET_URL,
  SINGLE_RUN_URL,
  translations,
} from './constants'
import { testMetadataDrawer } from './metadataDrawer/testMetadataDrawer'
import {
  getAnnotationTestMetdata,
  getDatasetTestMetadata,
  getTiltSeriesTestMetadata,
  getTomogramTestMetadata,
} from './metadataDrawer/utils'

testMetadataDrawer({
  url: SINGLE_DATASET_URL,

  async getTestData(client) {
    const { data } = await getDatasetById({
      client,
      id: +E2E_CONFIG.datasetId,
    })

    const [dataset] = data.datasets
    const [tiltSeries] = dataset.run_metadata[0].tiltseries

    return {
      title: dataset.title,
      metadata: {
        ...getDatasetTestMetadata({
          dataset,
          type: 'dataset',
        }),

        ...getTiltSeriesTestMetadata({
          tiltSeries,
          type: 'dataset',
        }),
      },
    }
  },

  async openDrawer(page) {
    await page.getByRole('button', { name: translations.viewAllInfo }).click()
  },
})

testMetadataDrawer({
  title: 'Run Metadata',
  url: SINGLE_RUN_URL,

  async getTestData(client) {
    const { data } = await getRunById({
      client,
      id: +E2E_CONFIG.runId,
    })

    const [run] = data.runs
    const [tiltSeries] = run.tiltseries
    const [tomogram] = run.tomogram_voxel_spacings[0].tomograms

    return {
      title: run.name,
      metadata: {
        ...getDatasetTestMetadata({
          dataset: run.dataset,
          type: 'run',
        }),

        ...getTiltSeriesTestMetadata({
          tiltSeries,
          type: 'run',
        }),

        ...getTomogramTestMetadata(tomogram),
      },
    }
  },

  async openDrawer(page) {
    await page.getByRole('button', { name: translations.viewAllInfo }).click()
  },
})

testMetadataDrawer({
  title: 'Annotation Metadata',
  url: SINGLE_RUN_URL,

  async getTestData(client) {
    const { data } = await getRunById({
      client,
      id: +E2E_CONFIG.runId,
    })

    const [run] = data.runs
    const annotation = run.annotation_table[0].annotations[0]

    return {
      title: `${annotation.id} - ${annotation.object_name}`,
      metadata: getAnnotationTestMetdata(annotation),
    }
  },

  async openDrawer(page) {
    await page
      .getByRole('button', { name: translations.info, exact: true })
      .first()
      .click()
  },
})
