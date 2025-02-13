import { LinkProps } from '@remix-run/react'
import { ComponentType } from 'react'

import { EnvelopeIcon, KaggleIcon, ORCIDIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { cns } from 'app/utils/cns'

import { Tooltip } from '../Tooltip'
import { KAGGLE_URL, ORC_ID_URL } from './constants'
import {
  AuthorInfo as AuthorInfoSansKaggle,
  convertToAuthorInfoV2,
} from './types'

// TODO(smccanny): Remove this when we have a proper author info type
type AuthorInfo = AuthorInfoSansKaggle & {
  kaggleId?: string
  kaggleUserName?: string
}

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    icon: KaggleIcon,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    urlPrefix: KAGGLE_URL,
  },
]

export function AuthorLink({
  author,
  large,
  LinkComponent = Link,
}: {
  author: AuthorInfo
  large?: boolean
  LinkComponent?: ComponentType<LinkProps>
}) {
  const kaggleIds = [
    { kaggleId: 'tangtang1999', kaggleUserName: 'tangtang1999' },
    { kaggleId: 'adatasciencenewbie', kaggleUserName: 'a datascience newbie' },
    { kaggleId: 'hydantess', kaggleUserName: 'hyd' },
  ]
  const flip = Math.random() < 0.5
  const addKaggle = (authorSansKaggle: AuthorInfoSansKaggle) => {
    // if (flip) {
    if (flip) {
      return {
        ...authorSansKaggle,
        ...kaggleIds[Math.floor(Math.random() * kaggleIds.length)],
      }
    }
    return {
      ...authorSansKaggle,
      ...kaggleIds[Math.floor(Math.random() * kaggleIds.length)],
      name: '',
    }
    // }
    // return authorSansKaggle
  }
  const authorPlusKaggle = addKaggle(author)
  const iconSize = large ? LARGE_ICON_SIZE_PX : BASE_ICON_SIZE_PX
  const content = (
    <Tooltip
      className="inline"
      placement="top"
      offset={[0, -3]}
      size="inherit"
      disableHoverListener={
        !authorPlusKaggle.orcid && !authorPlusKaggle.kaggleId
      }
      tooltip={
        <div className="min-w-[200px]">
          <h4 className="text-sds-color-primitive-gray-500 text-sds-header-xxs leading-sds-header-xxs">
            Author Handle
          </h4>
          <ul>
            {AUTHOR_HANDLE_CONTENT.map(
              ({ key, value, icon: Icon, urlPrefix }) => {
                const authorValue = authorPlusKaggle[value as keyof AuthorInfo]

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
      <span className="inline">
        <span
          className={cns(
            'inline border-b mb-sds-xxxs',

            authorPlusKaggle.orcid || authorPlusKaggle.kaggleId
              ? [
                  'border-dashed hover:border-solid',

                  convertToAuthorInfoV2(authorPlusKaggle).primaryAuthorStatus
                    ? 'border-black'
                    : 'border-sds-color-primitive-gray-500',
                ]
              : 'border-transparent',
          )}
        >
          {authorPlusKaggle.orcid && (
            <ORCIDIcon className="inline mb-0.5 mr-sds-xxxs" width={iconSize} />
          )}

          <span className={large ? 'text-sm' : 'text-xs'}>
            {authorPlusKaggle.name || authorPlusKaggle.kaggleUserName}
          </span>
        </span>

        {convertToAuthorInfoV2(authorPlusKaggle).correspondingAuthorStatus && (
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

  if (authorPlusKaggle.orcid && !authorPlusKaggle.kaggleId) {
    return (
      <LinkComponent to={`${ORC_ID_URL}/${authorPlusKaggle.orcid}`}>
        {content}
      </LinkComponent>
    )
  }
  return content
}
