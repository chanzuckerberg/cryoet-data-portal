export type AuthorInfo =
  | {
      corresponding_author_status?: boolean | null
      email?: string | null
      name: string
      orcid?: string | null
      primary_author_status?: boolean | null
    }
  | AuthorInfoV2

export type AuthorInfoV2 = {
  correspondingAuthorStatus?: boolean | null
  email?: string | null
  name: string
  orcid?: string | null
  primaryAuthorStatus?: boolean | null
}

// TODO(bchu): Delete this when everything migrated.
export function convertToAuthorInfoV2(author: AuthorInfo): AuthorInfoV2 {
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
