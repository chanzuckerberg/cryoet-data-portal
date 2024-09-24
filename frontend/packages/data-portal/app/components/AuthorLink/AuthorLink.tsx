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
          'inline border-b mb-sds-xxxs',

          author.orcid
            ? [
                'border-dashed hover:border-solid',

                author.primaryAuthorStatus
                  ? 'border-black'
                  : 'border-sds-color-primitive-gray-500',
              ]
            : 'border-transparent',
        )}
      >
        {author.orcid && (
          <ORCIDIcon className="inline mb-0.5 mr-sds-xxxs" width={iconSize} />
        )}

        <span className={large ? 'text-sm' : 'text-xs'}>{author.name}</span>
      </span>

      {author.correspondingAuthorStatus && (
        <EnvelopeIcon
          className={cns(
            'text-sds-color-primitive-gray-400 mx-sds-xxxs',
            'mb-2 inline-block h-sds-icon-xs w-sds-icon-xs',
          )}
        />
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
