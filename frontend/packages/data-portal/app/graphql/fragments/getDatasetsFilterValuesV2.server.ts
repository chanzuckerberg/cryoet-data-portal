import { gql } from 'app/__generated_v2__'

/**
 * Shares aggregate queries between datasets and deposition pages (the 2 pages are very similar).
 *
 * Parent query must define $depositionIdFilter. If $depositionIdFilter is undefined, the queries
 *  will count everything. It makes the fragment significantly more readable to allow sending an
 *  empty argument object.
 */
export const GET_DATASETS_AGGREGATES_FRAGMENT = gql(`
  fragment DatasetsAggregates on Query {
    distinctOrganismNames: datasetsAggregate(where: { depositionId: $depositionIdFilter }) {
      aggregate {
        count
        groupBy {
          organismName
        }
      }
    }

    distinctCameraManufacturers: tiltseriesAggregate(where: { depositionId: $depositionIdFilter }) {
      aggregate {
        count
        groupBy {
          cameraManufacturer
        }
      }
    }

    distinctReconstructionMethods: tomogramsAggregate(where: { depositionId: $depositionIdFilter }) {
      aggregate {
        count
        groupBy {
          reconstructionMethod
        }
      }
    }

    distinctReconstructionSoftwares: tomogramsAggregate(where: { depositionId: $depositionIdFilter }) {
      aggregate {
        count
        groupBy {
          reconstructionSoftware
        }
      }
    }

    distinctObjectNames: annotationsAggregate(where: { depositionId: $depositionIdFilter }) {
      aggregate {
        count
        groupBy {
          objectName
        }
      }
    }

    distinctShapeTypes: annotationShapesAggregate(where: { annotation: { depositionId: $depositionIdFilter } }) {
      aggregate {
        count
        groupBy {
          shapeType
        }
      }
    }
  }
`)
