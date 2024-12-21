import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  Annotation_File_Shape_Type_Enum,
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

      dataset {
        cellComponentName
        cellComponentId
        cellName
        cellStrainName
        cellStrainId
        cellTypeId
        depositionDate
        description
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
      framesAggregate {
        aggregate {
          count
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
    alignmentsAggregate(where: {run: {id: {_eq: $id}}}) {
      aggregate {
        count
      }
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
      shapeType
      annotationFiles {
        edges {
          node {
            alignmentId
            format
            httpsPath
            s3Path
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
  }
`)

function getAnnotationShapesFilter(
  runId: number,
  filterState: FilterState,
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
      _in: objectShapeTypes as Annotation_File_Shape_Type_Enum[],
    }
  }

  // Author filters
  const { name, orcid } = filterState.author
  if (name || orcid) {
    where.annotation!.authors = {}
  }
  if (name) {
    where.annotation!.authors!.name = {
      _ilike: `%${name}%`,
    }
  }
  if (orcid) {
    where.annotation!.authors!.orcid = {
      _ilike: `%${orcid}%`,
    }
  }

  // Annotation filters
  const { objectNames, annotationSoftwares, methodTypes, objectId } =
    filterState.annotation
  if (objectNames.length > 0) {
    where.annotation!.objectName = {
      _in: objectNames,
    }
  }
  if (objectId) {
    where.annotation!.objectId = {
      _ilike: `%${objectId.replace(':', '_')}`, // _ is wildcard
    }
  }
  if (methodTypes.length > 0) {
    where.annotation!.methodType = {
      _in: methodTypes as Annotation_Method_Type_Enum[],
    }
  }
  if (annotationSoftwares.length > 0) {
    where.annotation!.annotationSoftware = {
      _in: annotationSoftwares,
    }
  }

  return where
}

export async function getRunByIdV2(
  client: ApolloClient<NormalizedCacheObject>,
  id: number,
  annotationsPage: number,
  params: URLSearchParams = new URLSearchParams(),
): Promise<ApolloQueryResult<GetRunByIdV2Query>> {
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
    },
  })
}
