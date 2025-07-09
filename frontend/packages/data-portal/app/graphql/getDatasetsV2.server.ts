import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import { GetDatasetsV2Query, OrderBy } from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { getFilterState } from 'app/hooks/useFilter'

import { getDatasetsFilter } from './common'

const GET_DATASETS_QUERY = gql(`
  query GetDatasetsV2(
    $limit: Int,
    $offset: Int,
    $orderBy: [DatasetOrderByClause!]!,
    $datasetsFilter: DatasetWhereClause!,
    # Unused, but must be defined because DatasetsAggregates references them:
    $datasetsByDepositionFilter: DatasetWhereClause,
    $tiltseriesByDepositionFilter: TiltseriesWhereClause,
    $tomogramsByDepositionFilter: TomogramWhereClause,
    $annotationsByDepositionFilter: AnnotationWhereClause,
    $annotationShapesByDepositionFilter: AnnotationShapeWhereClause
  ) {
    datasets(
      where: $datasetsFilter
      orderBy: $orderBy,
      limitOffset: {
        limit: $limit,
        offset: $offset
      }
    ) {
      id
      title
      organismName
      datasetPublications
      keyPhotoThumbnailUrl
      relatedDatabaseEntries
      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            name
            primaryAuthorStatus
            correspondingAuthorStatus
          }
        }
      }
      runsCount: runsAggregate {
        aggregate {
          count
        }
      }
      distinctObjectNames: runsAggregate {
        aggregate {
          count
          groupBy {
            annotations {
              objectName
              groundTruthStatus
            }
          }
        }
      }
    }

    ...DatasetsAggregates
  }
`)

export async function getDatasetsV2({
  page,
  titleOrderDirection,
  searchText,
  params = new URLSearchParams(),
  client,
}: {
  page: number
  titleOrderDirection?: OrderBy
  searchText?: string
  params?: URLSearchParams
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetDatasetsV2Query>> {
  return client.query({
    query: GET_DATASETS_QUERY,
    variables: {
      datasetsFilter: getDatasetsFilter({
        filterState: getFilterState(params),
        searchText,
      }),
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
      // Default order primarily by release date.
      orderBy: titleOrderDirection
        ? [
            { title: titleOrderDirection },
            {
              releaseDate: OrderBy.Desc,
            },
          ]
        : [{ releaseDate: OrderBy.Desc }, { title: OrderBy.Asc }],
    },
  })
}
