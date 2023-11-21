/* eslint-disable no-underscore-dangle */

import { Button, CellHeaderDirection } from '@czi-sds/components'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { isNumber } from 'lodash-es'
import { match } from 'ts-pattern'

import { gql } from 'app/__generated__'
import { Datasets_Bool_Exp, Order_By } from 'app/__generated__/graphql'
import { apolloClient } from 'app/apollo.server'
import { DatasetTable } from 'app/components/BrowseData'
import { DatasetFilter } from 'app/components/DatasetFilter'
import { NoResults } from 'app/components/NoResults'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { DEFAULT_TILT_MAX, DEFAULT_TILT_MIN } from 'app/constants/tiltSeries'
import {
  DatasetFilterState,
  getDatasetFilter,
  useDatasetFilter,
} from 'app/hooks/useDatasetFilter'
import { useDatasets } from 'app/hooks/useDatasets'
import { i18n } from 'app/i18n'
import { getSelfCreatingObject } from 'app/utils/proxy'

const GET_DATASETS_DATA_QUERY = gql(`
  query GetDatasetsData(
    $limit: Int,
    $offset: Int,
    $order_by_dataset: order_by,
    $filter: datasets_bool_exp,
  ) {
    datasets(
      limit: $limit,
      offset: $offset,
      order_by: { title: $order_by_dataset },
      where: $filter
    ) {
      id
      title
      organism_name
      dataset_publications

      authors {
        name
        primary_author_status
      }

      runs_aggregate {
        aggregate {
          count
        }
      }
    }

    datasets_aggregate {
      aggregate {
        count
      }
    }

    filtered_datasets_aggregate: datasets_aggregate(where: $filter) {
      aggregate {
        count
      }
    }

    organism_names: datasets(distinct_on: organism_name) {
      organism_name
    }

    camera_manufacturers: tiltseries(distinct_on: camera_manufacturer) {
      camera_manufacturer
    }

    reconstruction_methods: tomograms(distinct_on: reconstruction_method) {
      reconstruction_method
    }

    reconstruction_softwares: tomograms(distinct_on: reconstruction_software) {
      reconstruction_software
    }

    object_names: annotations(distinct_on: object_name) {
      object_name
    }

    object_shape_types: annotations {
      files(distinct_on: shape_type) {
        shape_type
      }
    }
  }
`)

function getTiltValue(value: string | null) {
  if (value && !Number.isNaN(+value)) {
    return +value
  }

  return null
}

function getFilter(datasetFilter: DatasetFilterState, query: string) {
  const filter = getSelfCreatingObject<Datasets_Bool_Exp>()

  // Text search by dataset title
  if (query) {
    filter.title._ilike = `%${query}%`
  }

  // Included contents filters
  // Ground truth filter
  if (datasetFilter.includedContents.isGroundTruthEnabled) {
    filter.runs.tomogram_voxel_spacings.annotations.ground_truth_status._eq =
      true
  }

  // Available files filter
  datasetFilter.includedContents.availableFiles.forEach((file) =>
    match(file)
      .with('raw-frames', () => {
        filter.runs.tiltseries.binning_from_frames._gt = 0
      })
      .with('tilt-series', () => {
        filter.runs.tiltseries_aggregate.count.predicate._gt = 0
      })
      .with('tilt-series-alignment', () => {
        filter.runs.tiltseries.https_alignment_file._is_null = false
      })
      .with('tomogram', () => {
        filter.runs.tomogram_voxel_spacings.tomograms_aggregate.count.predicate._gt = 0
      })
      .exhaustive(),
  )

  // Number of runs filter
  if (datasetFilter.includedContents.numberOfRuns) {
    const runCount = +datasetFilter.includedContents.numberOfRuns.slice(1)
    filter.runs_aggregate.count.predicate._gte = runCount
  }

  // Id filters

  // Portal ID filter
  const portalId = +(datasetFilter.ids.portal ?? Number.NaN)
  if (!Number.isNaN(portalId) && portalId > 0) {
    filter.id._eq = portalId
  }

  // Empiar filter
  const empiarId = datasetFilter.ids.empiar
  if (empiarId) {
    filter.dataset_publications._like = `%EMPIAR-${empiarId}%`
  }

  // EMDB filter
  const emdbId = datasetFilter.ids.emdb
  if (emdbId) {
    filter.dataset_publications._like = `%EMD-${emdbId}%`
  }

  // Author filters

  // Author name filter
  if (datasetFilter.author.name) {
    filter.authors.name._ilike = `%${datasetFilter.author.name}%`
  }

  // Author Orcid filter
  if (datasetFilter.author.orcid) {
    filter.authors.orcid._ilike = `%${datasetFilter.author.orcid}%`
  }

  // Sample and experiment condition filters
  const { organismNames } = datasetFilter.sampleAndExperimentConditions

  // Organism name filter
  if (organismNames.length > 0) {
    filter.organism_name._in = organismNames
  }

  // Hardware filters
  // Camera manufacturer filter
  if (datasetFilter.hardware.cameraManufacturer) {
    filter.runs.tiltseries.camera_manufacturer._eq =
      datasetFilter.hardware.cameraManufacturer
  }

  // Tilt series metadata filters
  let tiltMin = getTiltValue(datasetFilter.tiltSeries.min)
  let tiltMax = getTiltValue(datasetFilter.tiltSeries.max)

  if (isNumber(tiltMin) && !isNumber(tiltMax)) {
    tiltMax = DEFAULT_TILT_MAX
  }

  if (!isNumber(tiltMin) && isNumber(tiltMax)) {
    tiltMin = DEFAULT_TILT_MIN
  }

  // Tilt range filter
  if (tiltMin && tiltMax) {
    filter.runs.tiltseries.tilt_min._gte = tiltMin
    filter.runs.tiltseries.tilt_max._lte = tiltMax
  }

  // Tomogram metadata filters
  if (datasetFilter.tomogram.fiducialAlignmentStatus) {
    filter.runs.tomogram_voxel_spacings.tomograms.fiducial_alignment_status._eq =
      datasetFilter.tomogram.fiducialAlignmentStatus === 'true'
        ? 'FIDUCIAL'
        : 'NON_FIDUCIAL'
  }

  // Reconstruction method filter
  if (datasetFilter.tomogram.reconstructionMethod) {
    filter.runs.tomogram_voxel_spacings.tomograms.reconstruction_method._eq =
      datasetFilter.tomogram.reconstructionMethod
  }

  // Reconstruction software filter
  if (datasetFilter.tomogram.reconstructionSoftware) {
    filter.runs.tomogram_voxel_spacings.tomograms.reconstruction_software._eq =
      datasetFilter.tomogram.reconstructionSoftware
  }

  // Annotation filters
  const { objectNames, objectShapeTypes } = datasetFilter.annotation

  // Object names filter
  if (objectNames.length > 0) {
    filter.runs.tomogram_voxel_spacings.annotations.object_name._in =
      objectNames
  }

  // Object shape type filter
  if (objectShapeTypes.length > 0) {
    filter.runs.tomogram_voxel_spacings.annotations.shape_type._in =
      objectShapeTypes
  }

  return filter
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const page = +(url.searchParams.get('page') ?? '1')
  const sort = (url.searchParams.get('sort') ?? undefined) as
    | CellHeaderDirection
    | undefined
  const search = url.searchParams.get('search') ?? ''

  let orderBy: Order_By | null = null

  if (sort) {
    orderBy = sort === 'asc' ? Order_By.Asc : Order_By.Desc
  }

  const { data } = await apolloClient.query({
    query: GET_DATASETS_DATA_QUERY,
    variables: {
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
      order_by_dataset: orderBy,
      filter: getFilter(getDatasetFilter(url.searchParams), search),
    },
  })

  return json(data)
}

export default function BrowseDatasetsPage() {
  const { datasetCount, filteredDatasetCount } = useDatasets()
  const { reset } = useDatasetFilter()

  return (
    <TablePageLayout
      filteredCount={filteredDatasetCount}
      filters={<DatasetFilter />}
      table={<DatasetTable />}
      totalCount={datasetCount}
      noResults={
        <NoResults
          title={i18n.filterNoResultsFound}
          description={i18n.filterTooRestrictive}
          actions={<Button onClick={reset}>{i18n.clearFilters}</Button>}
        />
      }
    />
  )
}
