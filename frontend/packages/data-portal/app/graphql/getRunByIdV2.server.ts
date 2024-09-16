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
