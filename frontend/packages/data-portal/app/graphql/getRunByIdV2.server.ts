import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  Annotation_Method_Type_Enum,
  AnnotationShapeWhereClause,
  GetRunByIdV2Query,
} from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FilterState, getFilterState } from 'app/hooks/useFilter'

const GET_RUN_BY_ID_QUERY_V2 = gql(`
  query GetRunByIdV2(
    $id: Int
    $limit: Int
    $annotationShapesOffset: Int
    $annotationShapesFilter: AnnotationShapeWhereClause
    $annotationShapesFilterGroundTruthTrue: AnnotationShapeWhereClause
    $annotationShapesFilterGroundTruthFalse: AnnotationShapeWhereClause
    $depositionId: Int
  ) {
    runs(where: { id: { _eq: $id } }) {
      id
      name

      # Metadata sidebar
      tiltseries(first: 1) {
        edges {
          node {
            accelerationVoltage
            alignedTiltseriesBinning
            binningFromFrames
            cameraManufacturer
            cameraModel
            dataAcquisitionSoftware
            id
            isAligned
            microscopeAdditionalInfo
            microscopeEnergyFilter
            microscopeImageCorrector
            microscopeManufacturer
            microscopeModel
            microscopePhasePlate
            pixelSpacing
            relatedEmpiarEntry
            sphericalAberrationConstant
            tiltAxis
            tiltMax
            tiltMin
            tiltRange
            tiltSeriesQuality
            tiltStep
            tiltingScheme
            totalFlux
          }
        }
      }

      annotations (where: {runId: {_eq: $id}}, ) {
        edges {
          node {
            depositionId
            objectId
            objectName
            objectDescription
            objectState
            s3MetadataPath
            httpsMetadataPath
          }
        }
      }

      dataset {
        cellComponentName
        cellComponentId
        cellName
        cellStrainName
        cellStrainId
        cellTypeId
        deposition {
          annotationsAggregate(
            where: {annotationShapesAggregate: {count: {filter: {annotationFiles: {isVisualizationDefault: {_eq: true}}}}}}
          ) {
            aggregate {
              count
            }
          }
        }
        depositionDate
        description
        fileSize
        gridPreparation
        id
        lastModifiedDate
        organismName
        organismTaxid
        otherSetup
        datasetPublications
        relatedDatabaseEntries
        relatedDatabaseEntries
        releaseDate
        s3Prefix
        samplePreparation
        sampleType
        tissueName
        tissueId
        title

        fundingSources(
          orderBy: {
            fundingAgencyName: asc
            grantId: asc
          }
        ) {
          edges {
            node {
              fundingAgencyName
              grantId
            }
          }
        }

        authors(
          orderBy: {
            authorListOrder: asc,
          },
        ) {
          edges {
            node {
              correspondingAuthorStatus
              email
              name
              orcid
              kaggleId
              primaryAuthorStatus
            }
          }
        }
      }

      # Legacy single tomogram
      tomogramVoxelSpacings(
        first: 1
        # where: {
        #   tomograms: {
        #     isAuthorSubmitted: { _eq: true} # TODO(bchu): Uncomment when bool bug fixed AND isAuthorSubmitted is populated.
        #   }
        # }
      ) {
        edges {
          node {
            id
            s3Prefix
            annotationFilesAggregate(
              where: {
                isVisualizationDefault: { _eq: true }
              }
            ) {
              aggregate {
                count
              }
            }
            tomograms(
              first: 1
              where: {
                isVisualizationDefault: { _eq: true }
              }
              # where: {
              #   isAuthorSubmitted: { _eq: true } # TODO(bchu): Uncomment when bool bug fixed.
              # }
            ) {
              edges {
                node {
                  ctfCorrected
                  fiducialAlignmentStatus
                  id
                  keyPhotoUrl
                  name
                  neuroglancerConfig
                  processing
                  processingSoftware
                  reconstructionMethod
                  reconstructionSoftware
                  sizeX
                  sizeY
                  sizeZ
                  voxelSpacing
                  alignment {
                    affineTransformationMatrix
                  }
                }
              }
            }
          }
        }
      }

      # Header
      # Filter by non-null frame file path since it can be null
      frames(where: {
        httpsFramePath: {
          _is_null: false
        },
      }) {
        edges {
          node {
            id
          }
        }
      }

      tiltseriesAggregate {
        aggregate {
          count
          avg {
            tiltSeriesQuality
          }
        }
      }
    }

    # Header
    # Filter by non-null alignment method since it can be null
    alignments(where: {
      alignmentMethod: { _is_null: false, },
      runId: { _eq: $id }
    }) {
      id
    }

    # Annotations table
    annotationShapes(
      where: $annotationShapesFilter
      orderBy: [
        {
          annotation: {
            groundTruthStatus: desc
          }
        },
        {
          annotation: {
            depositionDate: desc
          }
        },
        {
          annotation: {
            id: desc
          }
        }
      ]
      limitOffset: {
        limit: $limit
        offset: $annotationShapesOffset
      }
    ) {
      id
      shapeType
      annotationFiles {
        edges {
          node {
            alignmentId
            format
            httpsPath
            s3Path
            fileSize
          }
        }
      }
      annotation {
        annotationMethod
        annotationPublication
        annotationSoftware
        confidencePrecision
        confidenceRecall
        depositionDate
        groundTruthStatus
        groundTruthUsed
        id
        isCuratorRecommended
        lastModifiedDate
        methodLinks {
          edges {
            node {
              link
              linkType
              name
            }
          }
        }
        methodType
        objectCount
        objectDescription
        objectId
        objectName
        objectState
        releaseDate
        authors(orderBy: { authorListOrder: asc }) {
          edges {
            node {
              primaryAuthorStatus
              correspondingAuthorStatus
              name
              email
              orcid
            }
          }
        }
        authorsAggregate {
          aggregate {
            count
          }
        }
        deposition {
          id
          title
        }
      }
    }

    # Tomograms table + download selector
    tomograms(where: { run: { id: { _eq: $id } } }) {
      alignment {
        id
        affineTransformationMatrix
        alignmentType
        tiltOffset
        volumeXDimension
        volumeYDimension
        volumeZDimension
        volumeXOffset
        volumeYOffset
        volumeZOffset
        xRotationOffset
      }
      ctfCorrected
      fiducialAlignmentStatus
      fileSizeMrc
      fileSizeOmezarr
      httpsMrcFile
      id
      isPortalStandard
      isAuthorSubmitted
      isVisualizationDefault
      keyPhotoThumbnailUrl
      keyPhotoUrl
      name
      neuroglancerConfig
      processing
      processingSoftware
      reconstructionMethod
      reconstructionSoftware
      s3MrcFile
      s3OmezarrDir
      sizeX
      sizeY
      sizeZ
      voxelSpacing
      releaseDate
      lastModifiedDate
      relatedDatabaseEntries
      deposition {
        id
        depositionDate
        title
      }
      tomogramVoxelSpacing {
        id
        s3Prefix
      }
      authors {
        edges {
          node {
            primaryAuthorStatus
            correspondingAuthorStatus
            name
            email
            orcid
          }
        }
      }
    }

    # Annotation metadata:
    uniqueAnnotationSoftwares: annotationsAggregate(where: { runId: { _eq: $id }}) {
      aggregate {
        count
        groupBy {
          annotationSoftware
        }
      }
    }
    uniqueObjectNames: annotationsAggregate(where: { runId: { _eq: $id }}) {
      aggregate {
        count
        groupBy {
          objectName
        }
      }
    }
    uniqueShapeTypes: annotationShapesAggregate(where: { annotation: { runId: { _eq: $id }}}) {
      aggregate {
        count
        groupBy {
          shapeType
        }
      }
    }

    # Tomogram metadata:
    uniqueResolutions: tomogramVoxelSpacingsAggregate(where: { runId: { _eq: $id }}) {
      aggregate {
        count
        groupBy {
          voxelSpacing
        }
      }
    }
    uniqueProcessingMethods: tomogramsAggregate(where: { runId: { _eq: $id }}) {
      aggregate {
        count
        groupBy {
          processing
        }
      }
    }

    # Annotation counts:
    numTotalAnnotationRows: annotationShapesAggregate(where: { annotation: { runId: { _eq: $id }}}) {
      aggregate {
        count
      }
    }
    numFilteredAnnotationRows: annotationShapesAggregate(where: $annotationShapesFilter) {
      aggregate {
        count
      }
    }
    numFilteredGroundTruthAnnotationRows: annotationShapesAggregate(where: $annotationShapesFilterGroundTruthTrue) {
      aggregate {
        count
      }
    }
    numFilteredOtherAnnotationRows: annotationShapesAggregate(where: $annotationShapesFilterGroundTruthFalse) {
      aggregate {
        count
      }
    }

    numTotalSizeAnnotationFiles: annotationFilesAggregate(where: { annotationShape: { annotation: { runId: { _eq: $id }}}}) {
      aggregate {
        sum {
          fileSize
        }
      }
    }

    # Tomogram counts:
    tomogramsAggregate(where: { runId: { _eq: $id }}) {
      aggregate {
        count
      }
    }

    # CTF Aggregate
    perSectionParametersAggregate(
      where: { majorDefocus: { _is_null: false }, runId: { _eq: $id } }
    ) {
      aggregate {
        count
      }
    }
    # Alignment counts

    # Deposition banner
    # Returns empty array if $depositionId not defined
    depositions(where: { id: { _eq: $depositionId }}) {
      id
      title
    }
  }
`)

function getAnnotationShapesFilter(
  runId: number,
  filterState: FilterState,
  groundTruthStatus?: boolean,
): AnnotationShapeWhereClause {
  const where: AnnotationShapeWhereClause = {
    annotation: {
      run: {
        id: {
          _eq: runId,
        },
      },
    },
  }

  // Deposition filter
  const depositionId = +(filterState.ids.deposition ?? Number.NaN)
  if (!Number.isNaN(depositionId) && depositionId > 0) {
    where.annotation!.deposition = {
      id: {
        _eq: depositionId,
      },
    }
  }

  // Annotation shape filter
  const {
    annotation: { objectShapeTypes },
  } = filterState
  if (objectShapeTypes.length > 0) {
    where.shapeType = {
      _in: objectShapeTypes,
    }
  }

  // Author filters
  const { name, orcid } = filterState.author
  if (name) {
    where.annotation ??= { authors: {} }
    where.annotation.authors ??= {}
    where.annotation.authors.name = {
      _ilike: `%${name}%`,
    }
  }
  if (orcid) {
    where.annotation ??= { authors: {} }
    where.annotation.authors ??= {}
    where.annotation.authors.orcid = {
      _ilike: `%${orcid}%`,
    }
  }

  // Annotation filters
  const { objectNames, annotationSoftwares, methodTypes, objectId } =
    filterState.annotation
  if (objectNames.length > 0) {
    where.annotation ??= {}
    where.annotation.objectName = {
      _in: objectNames,
    }
  }
  if (objectId) {
    where.annotation ??= {}
    where.annotation.objectId = {
      _ilike: `%${objectId.replace(':', '_')}`, // _ is wildcard
    }
  }
  if (methodTypes.length > 0) {
    where.annotation ??= {}
    where.annotation.methodType = {
      _in: methodTypes as Annotation_Method_Type_Enum[],
    }
  }
  if (annotationSoftwares.length > 0) {
    where.annotation ??= {}
    where.annotation.annotationSoftware = {
      _in: annotationSoftwares,
    }
  }

  // Ground truth dividers
  if (groundTruthStatus !== undefined) {
    where.annotation ??= {}
    where.annotation.groundTruthStatus = {
      _eq: groundTruthStatus,
    }
  }

  return where
}

export interface GetRunByIdV2Params {
  client: ApolloClient<NormalizedCacheObject>
  id: number
  annotationsPage: number
  params?: URLSearchParams
  depositionId?: number
}

export async function getRunByIdV2({
  client,
  id,
  annotationsPage,
  params = new URLSearchParams(),
  depositionId,
}: GetRunByIdV2Params): Promise<ApolloQueryResult<GetRunByIdV2Query>> {
  return client.query({
    query: GET_RUN_BY_ID_QUERY_V2,
    variables: {
      id,
      limit: MAX_PER_PAGE,
      annotationShapesOffset: (annotationsPage - 1) * MAX_PER_PAGE,
      annotationShapesFilter: getAnnotationShapesFilter(
        id,
        getFilterState(params),
      ),
      annotationShapesFilterGroundTruthTrue: getAnnotationShapesFilter(
        id,
        getFilterState(params),
        /* groundTruthStatus */ true,
      ),
      annotationShapesFilterGroundTruthFalse: getAnnotationShapesFilter(
        id,
        getFilterState(params),
        /* groundTruthStatus */ false,
      ),
      depositionId,
    },
  })
}
