import { Dataset_Authors, Datasets } from 'app/__generated__/graphql'
import { RecursivePartial } from 'app/utils/RecursivePartial'

export type DatasetType = RecursivePartial<Datasets> & {
  authors_with_affiliation?: RecursivePartial<Dataset_Authors>[]
}
