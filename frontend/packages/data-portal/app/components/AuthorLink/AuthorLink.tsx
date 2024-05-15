import { LinkProps } from '@remix-run/react'
import { ComponentType } from 'react'

import { EnvelopeIcon, ORCIDIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { cns } from 'app/utils/cns'

import { ORC_ID_URL } from './constants'
import { AuthorInfo } from './types'

const BASE_ICON_SIZE_PX = 10
const LARGE_ICON_SIZE_PX = 14

export function AuthorLink({
  author,
  large,
  LinkComponent = Link,
}: {
  author: AuthorInfo
  large?: boolean
  LinkComponent?: ComponentType<LinkProps>
}) {
  const iconSize = large ? LARGE_ICON_SIZE_PX : BASE_ICON_SIZE_PX
  const content = (
    <span className="inline">
      <span
        className={cns(
          'inline border-b pb-sds-xxxs',

          author.orcid
            ? [
                'border-dashed hover:border-solid',

                author.primary_author_status
                  ? 'border-black'
                  : 'border-sds-gray-500',
              ]
            : 'border-transparent',
        )}
      >
        {author.orcid && (
          <ORCIDIcon className="inline mb-0.5" width={iconSize} />
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
