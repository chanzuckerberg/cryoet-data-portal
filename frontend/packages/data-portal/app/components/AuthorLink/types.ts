import { DeepPartial } from 'utility-types'

import { Dataset_Authors } from 'app/__generated__/graphql'
import { Author } from 'app/types/gql/genericTypes'

export type AuthorInfo = DeepPartial<Dataset_Authors> | Author

// TODO(kira-api-migration): Delete this when everything migrated.
export function convertToAuthorInfoV2(author: AuthorInfo): Author {
  return 'corresponding_author_status' in author ||
    'primary_author_status' in author
    ? {
        correspondingAuthorStatus: author.corresponding_author_status,
        email: author.email,
        name: author.name ?? '',
        orcid: author.orcid,
        primaryAuthorStatus: author.primary_author_status,
      }
    : author
}
