import {
  Annotations,
  Datasets,
  Tiltseries,
  Tomograms,
} from 'app/__generated__/graphql'
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
          dataset: dataset as unknown as Datasets,
          type: 'dataset',
        }),

        ...getTiltSeriesTestMetadata({
          tiltSeries: tiltSeries as Tiltseries,
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
          dataset: run.dataset as unknown as Datasets,
          type: 'run',
        }),

        ...getTiltSeriesTestMetadata({
          tiltSeries: tiltSeries as Tiltseries,
          type: 'run',
        }),

        ...getTomogramTestMetadata(tomogram as Tomograms),
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
      metadata: getAnnotationTestMetdata(annotation as unknown as Annotations),
    }
  },

  async openDrawer(page) {
    await page
      .getByRole('button', { name: translations.info, exact: true })
      .first()
      .click()
  },
})
