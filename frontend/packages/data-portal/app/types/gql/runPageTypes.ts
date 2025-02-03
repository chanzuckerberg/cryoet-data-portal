import { GetRunByIdQuery } from 'app/__generated__/graphql'
import { GetRunByIdV2Query } from 'app/__generated_v2__/graphql'

export type AnnotationFile =
  GetRunByIdV2Query['annotationShapes'][number]['annotationFiles']['edges'][number]['node']
export type AnnotationShape = GetRunByIdV2Query['annotationShapes'][number]
export type Tomogram = GetRunByIdQuery['tomograms'][number]
export type TomogramV2 = GetRunByIdV2Query['tomograms'][number]
