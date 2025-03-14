import Skeleton from '@mui/material/Skeleton'
import { range } from 'lodash-es'
import { ReactNode } from 'react'

import { Link } from 'app/components/Link'
import { ANNOTATED_OBJECTS_MAX } from 'app/constants/pagination'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

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
                className="shrink-0"
                placement="top-start"
                sdsStyle="light"
                slotProps={{
                  tooltip: {
                    style: {
                      maxWidth: 199, // Override the max-width specification for dark sdsStyle.
                    },
                  },
                }}
                tooltip={
                  <>
                    Ground truth annotation(s) available.{' '}
                    <span className="text-sds-color-primitive-blue-400">
                      <Link to="https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_data_portal_docsite_data.html#ground-truth-flagn">
                        Learn more
                      </Link>
                    </span>
                  </>
                }
              >
                {obj[1] ? (
                  <span className="h-18 w-18 text-[10px] text-[#0041B9] bg-[#E2EEFF] rounded-full px-[2.5px] py-[3px] tracking-[-0.3px] !font-[400]">
                    GT
                  </span>
                ) : (
                  ''
                )}
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
            tooltip={<List className="font-semibold">{nodes}</List>}
          >
            <div
              className={cns(
                'bg-sds-color-primitive-gray-200 text-sds-color-primitive-gray-600 hover:cursor-pointer',
                'text-sds-body-xxxs leading-sds-body-xxxs',
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
