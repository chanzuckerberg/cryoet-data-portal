import { Dataset_Authors } from 'app/__generated__/graphql'

export type AuthorInfo = Pick<
  Dataset_Authors,
  | 'corresponding_author_status'
  | 'email'
  | 'name'
  | 'orcid'
  | 'primary_author_status'
>
