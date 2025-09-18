import { gql } from 'app/__generated_v2__'

/**
 * Shares aggregate queries between datasets and deposition pages (the 2 pages are very similar).
 *
 * Parent query must define the following variables:
 * - $datasetsFilter: DatasetWhereClause
 * - $datasetsByDepositionFilter: DatasetWhereClause
 * - $tiltseriesByDepositionFilter: TiltseriesWhereClause
 * - $tomogramsByDepositionFilter: TomogramWhereClause
 * - $annotationsByDepositionFilter: AnnotationWhereClause
 * - $annotationShapesByDepositionFilter: AnnotationShapeWhereClause
 * - $identifiedObjectsByDepositionFilter: IdentifiedObjectWhereClause
 */
export const GET_DATASETS_AGGREGATES_FRAGMENT = gql(`
  fragment DatasetsAggregates on Query {
    filteredDatasetsCount: datasetsAggregate(where: $datasetsFilter) {
      aggregate {
        count
      }
    }
    totalDatasetsCount: datasetsAggregate(where: $datasetsByDepositionFilter) {
      aggregate {
        count
      }
    }

    distinctOrganismNames: datasetsAggregate(where: $datasetsByDepositionFilter) {
      aggregate {
        count
        groupBy {
          organismName
        }
      }
    }
    distinctCameraManufacturers: tiltseriesAggregate(where: $tiltseriesByDepositionFilter) {
      aggregate {
        count
        groupBy {
          cameraManufacturer
        }
      }
    }
    distinctReconstructionMethods: tomogramsAggregate(where: $tomogramsByDepositionFilter) {
      aggregate {
        count
        groupBy {
          reconstructionMethod
        }
      }
    }
    distinctReconstructionSoftwares: tomogramsAggregate(where: $tomogramsByDepositionFilter) {
      aggregate {
        count
        groupBy {
          reconstructionSoftware
        }
      }
    }
    distinctObjectNames: annotationsAggregate(where: $annotationsByDepositionFilter) {
      aggregate {
        count
        groupBy {
          objectName
        }
      }
    }
    distinctIdentifiedObjectNames: identifiedObjectsAggregate(where: $identifiedObjectsByDepositionFilter) {
      aggregate {
        count
        groupBy {
          objectName
        }
      }
    }
    distinctShapeTypes: annotationShapesAggregate(where: $annotationShapesByDepositionFilter) {
      aggregate {
        count
        groupBy {
          shapeType
        }
      }
    }
  }
`)
