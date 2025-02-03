import { DeepPartial } from 'utility-types'

import {
  AnnotationMethodLink as AnnotationMethodLinkObject,
  Dataset as DatasetObject,
  DatasetAuthor,
  Tiltseries as TiltseriesObject,
} from 'app/__generated_v2__/graphql'

// There is no generic Author object, so pick one arbitrarily and remove its connections.
export type Author = DeepPartial<
  Pick<
    DatasetAuthor,
    | 'affiliationAddress'
    | 'affiliationIdentifier'
    | 'affiliationName'
    | 'authorListOrder'
    | 'correspondingAuthorStatus'
    | 'email'
    | 'name'
    | 'orcid'
    | 'primaryAuthorStatus'
  >
>
export type AnnotationMethodLink = DeepPartial<AnnotationMethodLinkObject>
export type Dataset = DeepPartial<DatasetObject>
export type Tiltseries = DeepPartial<TiltseriesObject>
