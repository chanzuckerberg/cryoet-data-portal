import { Dataset_Authors } from 'app/__generated__/graphql'

export type AuthorInfo = Pick<
  Dataset_Authors,
  'name' | 'primary_author_status' | 'corresponding_author_status' | 'email'
>

export function AuthorLink() {
  return null
}
