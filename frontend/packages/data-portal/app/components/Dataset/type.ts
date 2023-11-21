import { DeepPartial } from 'utility-types'

import { Dataset_Authors, Datasets } from 'app/__generated__/graphql'

export type DatasetType = DeepPartial<Datasets> & {
  authors_with_affiliation?: DeepPartial<Dataset_Authors>[]
}
