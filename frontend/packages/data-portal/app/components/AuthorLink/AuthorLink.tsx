import { LinkProps } from '@remix-run/react'
import { ComponentType } from 'react'

import { EnvelopeIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { cns } from 'app/utils/cns'

import { ORC_ID_URL } from './constants'
import orcIdImage from './orcid.png'
import { AuthorInfo } from './types'

const BASE_ICON_SIZE = 10
const LARGE_ICON_SIZE = 14

export function AuthorLink({
  author,
  large,
  LinkComponent = Link,
}: {
  author: AuthorInfo
  large?: boolean
  LinkComponent?: ComponentType<LinkProps>
}) {
  const iconSize = large ? LARGE_ICON_SIZE : BASE_ICON_SIZE
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
            width={iconSize}
            height={iconSize}
          />
        )}

        <span className={cns('ml-sds-xxxs', large ? 'text-sm' : 'text-xs')}>
          {author.name}
        </span>
      </span>

      {author.email && (
        <LinkComponent to={`mailto:${author.email}`}>
          <EnvelopeIcon
            className={cns(
              'text-sds-gray-400 mx-sds-xxxs',
              'align-top inline-block h-sds-icon-xs w-sds-icon-xs',
            )}
          />
        </LinkComponent>
      )}
    </span>
  )

  if (author.orcid) {
    return (
      <LinkComponent to={`${ORC_ID_URL}/${author.orcid}`}>
        {content}
      </LinkComponent>
    )
  }

  return content
}
