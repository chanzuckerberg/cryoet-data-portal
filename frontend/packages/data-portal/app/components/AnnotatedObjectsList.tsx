import Skeleton from '@mui/material/Skeleton'
import { range } from 'lodash-es'
import { ReactNode } from 'react'

import { MiniTag } from 'app/components/common/MiniTag/MiniTag'
import { ANNOTATED_OBJECTS_MAX } from 'app/constants/pagination'
import { SITE_LINKS } from 'app/constants/siteLinks'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { Link } from './Link'
import { Tooltip } from './Tooltip'

function List({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <ul className={cns('list-none flex flex-col gap-sds-xs', className)}>
      {children}
    </ul>
  )
}

export function AnnotatedObjectsList({
  annotatedObjects,
  isLoading,
}: {
  annotatedObjects: Map<string, boolean>
  isLoading?: boolean
}) {
  const { t } = useI18n()
  const annotatedObjectsArray = Array.from(annotatedObjects)
  if (annotatedObjectsArray.length === 0) {
    return null
  }

  const nodes = isLoading
    ? range(0, ANNOTATED_OBJECTS_MAX).map((val: number) => (
        <Skeleton key={`skeleton-${val}`} variant="rounded" />
      ))
    : annotatedObjectsArray
        .sort((val1, val2) =>
          val1[0].toLowerCase().localeCompare(val2[0].toLowerCase()),
        )
        .map((obj) => {
          return (
            <li className="break-all flex items-center" key={obj[0]}>
              <span className="shrink line-clamp-1 mr-sds-xxs">{obj[0]}</span>
              <Tooltip
                data-testid={`${obj[0]}-gtTag`}
                className="shrink-0"
                placement="top-start"
                sdsStyle="light"
                offset={[0, -10]}
                slotProps={{
                  tooltip: {
                    style: {
                      maxWidth: 210, // Override the max-width specification for dark sdsStyle.
                    },
                  },
                }}
                tooltip={
                  <>
                    {t('groundTruthAnnotationAvailable')}{' '}
                    <Link
                      className="cursor-pointer text-light-sds-color-primitive-blue-500 border-solid hover:border-b border-light-sds-color-primitive-blue-500"
                      to={SITE_LINKS.GROUND_TRUTH_FLAG_DOCS}
                      stopPropagation
                    >
                      {t('learnMore')}
                    </Link>
                  </>
                }
              >
                {obj[1] ? <MiniTag>{t('gT')}</MiniTag> : ''}
              </Tooltip>
            </li>
          )
        })

  return (
    <List>
      {nodes.slice(
        0,
        nodes.length > ANNOTATED_OBJECTS_MAX
          ? ANNOTATED_OBJECTS_MAX - 1
          : Infinity,
      )}

      {nodes.length > ANNOTATED_OBJECTS_MAX && (
        <li>
          <Tooltip
            classes={{ tooltip: '!p-0 !bg-transparent' }}
            placement="left"
            tooltip={
              <div className="relative max-h-64">
                <div className="max-h-64 overflow-y-auto">
                  <List className="font-semibold pb-2">{nodes}</List>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
              </div>
            }
          >
            <div
              className={cns(
                'bg-light-sds-color-primitive-gray-200 text-light-sds-color-primitive-gray-600 hover:cursor-pointer',
                'text-sds-body-xxxs-400-wide leading-sds-body-xxxs',
                'rounded-sds-m py-sds-xxxs px-sds-xs inline',
              )}
            >
              {t('nMoreObjects', {
                count: nodes.length,
              })}
            </div>
          </Tooltip>
        </li>
      )}
    </List>
  )
}
