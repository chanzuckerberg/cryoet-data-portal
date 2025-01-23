import { GetRunByIdQuery } from 'app/__generated__/graphql'
import { GetRunByIdV2Query } from 'app/__generated_v2__/graphql'

export type Tomogram = GetRunByIdQuery['tomograms'][number]
export type TomogramV2 = GetRunByIdV2Query['tomograms'][number]
