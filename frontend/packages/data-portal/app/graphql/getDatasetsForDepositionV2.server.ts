/**
 * Pulls all datasets associated with a deposition.
 * Three ways for a dataset to be associated:
 * 1) Direct association, the dataset says it belong to deposition.
 * 2) The dataset contains a tomogram that belongs to deposition.
 * 3) The dataset contains an annotation that belongs to deposition.
 *     ^^^ Note: For #3, we actually do counts off shape so more useful elsewhere
 *
 * It's possible for any combo of these 3 to be true simultaneously.
 * HOWEVER, for the expand depositions work, we don't actually care about #1.
 * We only expose datasets through context of user viewing annotations or tomograms,
 * so if a dataset only is associated because of #1, it's not used in current UX
 * (although I think it would be very weird for a dataset to be owned by a deposition
 * but have no tomograms or annotations in that dataset also owned).
 *
 * Additionally, we might care about tracking which datasets are associated due to
 * #2 or #3. For instance, to show the "Group by" of datasets (and runs), you wouldn't
 * want to have a line dedicated to a dataset that only has tomograms for the deposition
 * if you're currently viewing the annotations tab.
 *
 * For the queries in this file, the use of the `count` is not immediately used for
 * purposes of collecting all the datasets based on #2 or #3, it's mostly there because
 * we can't run `groupBy` queries without a `count` in place. However, it does have the
 * benefit of being useful for displaying count info on the "Group by" accordion rows
 * (ex: Dataset ABC  has ?? runs | ## annotations), we can use the results from this to
 * pull the count of annotations / tomograms for a given dataset. (And can sum up against
 * it for getting the count on an organism, since an organism is really just a list of datasets.)
 * Note: For #3, we actually provide the counts off the # AnnotationShapes, not just
 * the annotations since it's the former that is how we present # annotations in UX.
 *
 * We are not trying to limit the returned results at all since we need to know _all_ the
 * datasets at once to present it to the user. This should be safe because the number of datasets
 * is fairly limited and the amount of data we pull per dataset is pretty small.
 * If this eventually becomes an issue (say, CryoET has lots more datasets in the future and
 * some wacky deposition has 1 thing in every single one of them), we'll have to rethink stuff.
 */
import {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import { GetDatasetsForDepositionViaAnnotationShapesQuery, GetDatasetsForDepositionViaTomogramsQuery } from 'app/__generated_v2__/graphql'

const GET_DATASETS_FOR_DEPOSITION_VIA_TOMOGRAMS = gql(`
  query getDatasetsForDepositionViaTomograms(
    $depositionId: Int!
  ) {
    tomogramsAggregate(where: {depositionId: {_eq: $depositionId}}) {
      aggregate {
        count(columns: id)
        groupBy {
          run {
            dataset {
              id
              title
              organismName
              organismTaxid
            }
          }
        }
      }
    }
  }
`)

// Strictly speaking, we can get the dataset info just as easily off annotations.
// But instead by pulling this off the AnnotationShapes, the count is accurate
// for how we display # annotations to the user (# shapes, not parent annotations)
const GET_DATASETS_FOR_DEPOSITION_VIA_ANNOTATION_SHAPES = gql(`
  query getDatasetsForDepositionViaAnnotationShapes(
    $depositionId: Int!
  ) {
    annotationShapesAggregate(
      where: {
        annotation: {
          depositionId: {_eq: $depositionId}
        }
      }
    ) {
      aggregate {
        count(columns: id)
        groupBy {
          annotation {
            run {
              dataset {
                id
                title
                organismName
                organismTaxid
              }
            }
          }
        }
      }
    }
  }
`)

export async function getDatasetsForDepositionViaTomograms({
  client,
  depositionId,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
}): Promise<ApolloQueryResult<GetDatasetsForDepositionViaTomogramsQuery>> {
  return client.query({
    query: GET_DATASETS_FOR_DEPOSITION_VIA_TOMOGRAMS,
    variables: {
      depositionId,
    }
  })
}

export async function getDatasetsForDepositionViaAnnotationShapes({
  client,
  depositionId,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
}): Promise<ApolloQueryResult<GetDatasetsForDepositionViaAnnotationShapesQuery>> {
  return client.query({
    query: GET_DATASETS_FOR_DEPOSITION_VIA_ANNOTATION_SHAPES,
    variables: {
      depositionId,
    }
  })
}
