import { DeepPartial } from 'utility-types'

import {
  Dataset as DatasetObject,
  Tiltseries as TiltseriesObject,
} from 'app/__generated_v2__/graphql'

export type Dataset = DeepPartial<DatasetObject>
export type Tiltseries = DeepPartial<TiltseriesObject>
