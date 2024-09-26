import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import { GetRunByIdV2Query } from 'app/__generated_v2__/graphql'

const GET_RUN_BY_ID_QUERY_V2 = gql(`
    query GetRunByIdV2(
      $id: Int
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
          # publications # TODO(bchu): Change to new name.
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
      # TODO(bchu)

      # Tomograms table + download selector
      tomograms(where: { run: { id: { _eq: $id } } }) {
        ctfCorrected
        fiducialAlignmentStatus
        httpsMrcFile
        id
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
        deposition {
          id
          depositionDate
          depositionTitle
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

export async function getRunByIdV2(
  client: ApolloClient<NormalizedCacheObject>,
  id: number,
): Promise<ApolloQueryResult<GetRunByIdV2Query>> {
  return client.query({
    query: GET_RUN_BY_ID_QUERY_V2,
    variables: {
      id,
    },
  })
}
