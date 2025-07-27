/**
 * - Created new version of GET_DEPOSITION_ANNOTATIONS that handles sorting and dataset filtering
 *   I believe the original GET_DEPOSITION_ANNOTATIONS query will probably still be necessary
 *   since having two queries is still the easiest way to handle a version without and a version
 *   with dataset filtering. However, the original version very likely needs to bring in the
 *   `orderBy` clause of the newer version so it sorts the same way as the existing annotation
 *   tables and matches the design. (I just pulled the sorting logic from GET_RUN_BY_ID_QUERY_V2)
 *   since that's the approach we're trying to match, pretty sure it works here!
 * - Note the `pageSize` arg for the function to do client query on above
 *   This is necessary because we serve the same kind of data whether we filter based on user
 *   directly filtering for a dataset or doing a "Group by" on organism, BUT the page size of
 *   those two cases is different (20 for the former, 5 for the latter)
 * - Possible we could optimize the annotationFiles out of existence, pull the path from
 *   the Annotation path (either s3MetadataPath or httpsMetadataPath, same diff for the
 *   number we want out of the path), but I don't know if different shapes have different
 *   files or they all belong to the same file somehow, needs more data exploration.
 * - I didn't have time to write the equivalent version of this for tomograms, but I think it will
 *   be extremely similar. Sorry!
 */
import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import type { GetDepositionAnnotationsQuery } from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { getFilterState } from 'app/hooks/useFilter'

import { getDepositionAnnotationsFilter } from './common'

const GET_DEPOSITION_ANNOTATIONS = gql(`
  query GetDepositionAnnotations(
    $depositionAnnotationsFilter: AnnotationShapeWhereClause!,
    $limit: Int!,
    $offset: Int!,
  ) {
    annotationShapes(
      where: $depositionAnnotationsFilter,
      limitOffset: {
        limit: $limit,
        offset: $offset,
      },
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
    ) {
      id
      shapeType

      annotation {
        groundTruthStatus
        id
        methodType
        objectName

        run {
          id
          name

          dataset {
            id
            title
          }
        }
      }

      annotationFiles(first: 1) {
        edges {
          node {
            s3Path
          }
        }
      }
    }
  }
`)

export async function getDepositionAnnotations({
  client,
  depositionId,
  page,
  pageSize = MAX_PER_PAGE,
  params = new URLSearchParams(),
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
  page: number
  pageSize?: number
  params?: URLSearchParams
}): Promise<ApolloQueryResult<GetDepositionAnnotationsQuery>> {
  const filterState = getFilterState(params)
  const datasetIds = filterState.ids.datasets
    .map((id) => parseInt(id))
    .filter((id) => Number.isInteger(id))
  const { organismNames } = filterState.sampleAndExperimentConditions

  return client.query({
    query: GET_DEPOSITION_ANNOTATIONS,
    variables: {
      depositionAnnotationsFilter: getDepositionAnnotationsFilter({
        depositionId,
        datasetIds: datasetIds.length > 0 ? datasetIds : undefined,
        organismNames: organismNames.length > 0 ? organismNames : undefined,
      }),
      limit: pageSize,
      offset: (page - 1) * pageSize,
    },
  })
}
