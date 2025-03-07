import { LinkProps } from '@remix-run/react'
import { ComponentType } from 'react'

import { EnvelopeIcon, KaggleIcon, ORCIDIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { TestIds } from 'app/constants/testIds'
import { Author } from 'app/types/gql/genericTypes'
import { cns } from 'app/utils/cns'

import { Tooltip } from '../Tooltip'
import { KAGGLE_URL, ORC_ID_URL } from './constants'

const BASE_ICON_SIZE_PX = 10
const LARGE_ICON_SIZE_PX = 14

const AUTHOR_HANDLE_CONTENT = [
  {
    key: 'ORCID',
    value: 'orcid',
    icon: ORCIDIcon,
    urlPrefix: ORC_ID_URL,
  },
  {
    key: 'Kaggle',
    value: 'kaggleId',
    icon: KaggleIcon,
    urlPrefix: KAGGLE_URL,
  },
]

export function AuthorLink({
  author,
  large,
  LinkComponent = Link,
}: {
  author: Author
  large?: boolean
  LinkComponent?: ComponentType<LinkProps>
}) {
  const iconSize = large ? LARGE_ICON_SIZE_PX : BASE_ICON_SIZE_PX
  const content = (
    <Tooltip
      className="inline cursor-pointer"
      placement="top"
      offset={[0, -5]}
      size="inherit"
      disableHoverListener={!author.orcid && !author.kaggleId}
      tooltip={
        <div className="min-w-[200px] pt-sds-xxs pb-sds-s">
          <h4 className="text-sds-color-primitive-gray-500 text-sds-header-xxs leading-sds-header-xxs font-semibold mb-sds-s">
            Author Handle(s)
          </h4>
          <ul>
            {AUTHOR_HANDLE_CONTENT.map(
              ({ key, value, icon: Icon, urlPrefix }) => {
                const authorValue = author[value as keyof Author]

                return (
                  authorValue && (
                    <li
                      key={key}
                      className="grid grid-cols-[1fr,auto] grid-rows-auto gap-sds-l"
                    >
                      <span className="flex items-center">
                        <Icon className="mr-sds-xxxs" width={iconSize} />
                        {key}
                      </span>
                      <Link
                        to={`${urlPrefix}/${authorValue}`}
                        variant="dashed-underlined"
                      >
                        {authorValue}
                      </Link>
                    </li>
                  )
                )
              },
            )}
          </ul>
        </div>
      }
      sdsStyle="light"
    >
      <span className="inline" data-testid={TestIds.AuthorLink}>
        <span
          className={cns(
            'inline border-b mb-sds-xxxs',

            author.orcid || author.kaggleId
              ? [
                  'border-dashed hover:border-solid',

                  author.primaryAuthorStatus === true
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

        {author.correspondingAuthorStatus === true && (
          <EnvelopeIcon
            className={cns(
              'text-sds-color-primitive-gray-400 mx-sds-xxxs',
              'mb-2 inline-block h-sds-icon-xs w-sds-icon-xs',
            )}
          />
        )}
      </span>
    </Tooltip>
  )

  if (author.orcid && !author.kaggleId) {
    return (
      <LinkComponent to={`${ORC_ID_URL}/${author.orcid}`}>
        {content}
      </LinkComponent>
    )
  }
  return content
}
