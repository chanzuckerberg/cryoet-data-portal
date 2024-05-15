import { Dataset_Authors } from 'app/__generated__/graphql'
import { EnvelopeIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { cns } from 'app/utils/cns'

import orcIdImage from './orcid.png'

export type AuthorInfo = Pick<
  Dataset_Authors,
  | 'corresponding_author_status'
  | 'email'
  | 'name'
  | 'orcid'
  | 'primary_author_status'
>

const ORC_ID_URL = 'https://orcid.org'

export function AuthorLink({ author }: { author: AuthorInfo }) {
  const content = (
    <span className="inline">
      <span
        className={cns(
          'inline border-b',

          author.orcid
            ? [
                'border-dashed',

                author.primary_author_status
                  ? 'border-black'
                  : 'border-sds-gray-500',
              ]
            : 'border-transparent',
        )}
      >
        {author.orcid && (
          <img
            className="inline"
            src={orcIdImage}
            alt="orc-id"
            width={10}
            height={10}
          />
        )}

        <span className="ml-sds-xxxs">{author.name}</span>
      </span>

      {author.email && (
        <Link to={`mailto:${author.email}`}>
          <EnvelopeIcon
            className={cns(
              'text-sds-gray-400 mx-sds-xxxs',
              'align-top inline-block h-sds-icon-xs w-sds-icon-xs',
            )}
          />
        </Link>
      )}
    </span>
  )

  if (author.orcid) {
    return <Link to={`${ORC_ID_URL}/${author.orcid}`}>{content}</Link>
  }

  return content
}
