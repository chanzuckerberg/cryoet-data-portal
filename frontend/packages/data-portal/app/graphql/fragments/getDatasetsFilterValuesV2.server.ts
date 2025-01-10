import { gql } from 'app/__generated_v2__'

/**
 * Shares filter options queries between datasets and deposition pages (filters are near identical).
 *
 * Parent query must define $depositionFilter.
 */
export const GET_DATASETS_FILTER_VALUES_FRAGMENT = gql(`
  fragment DatasetsAggregates on Query {
    distinctOrganismNames: datasetsAggregate(where: { depositionId: $depositionFilter }) {
      aggregate {
        count
        groupBy {
          organismName
        }
      }
    }

    distinctCameraManufacturers: tiltseriesAggregate(where: { depositionId: $depositionFilter }) {
      aggregate {
        count
        groupBy {
          cameraManufacturer
        }
      }
    }

    distinctReconstructionMethods: tomogramsAggregate(where: { depositionId: $depositionFilter }) {
      aggregate {
        count
        groupBy {
          reconstructionMethod
        }
      }
    }

    distinctReconstructionSoftwares: tomogramsAggregate(where: { depositionId: $depositionFilter }) {
      aggregate {
        count
        groupBy {
          reconstructionSoftware
        }
      }
    }

    distinctObjectNames: annotationsAggregate(where: { depositionId: $depositionFilter }) {
      aggregate {
        count
        groupBy {
          objectName
        }
      }
    }

    distinctShapeTypes: annotationShapesAggregate(where: { annotation: { depositionId: $depositionFilter } }) {
      aggregate {
        count
        groupBy {
          shapeType
        }
      }
    }
  }
`)
