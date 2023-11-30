import { Tooltip } from '@czi-sds/components'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import { range } from 'lodash-es'
import { ReactNode } from 'react'

import { ANNOTATED_OBJECTS_MAX } from 'app/constants/pagination'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

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
  annotatedObjects: string[]
  isLoading?: boolean
}) {
  if (annotatedObjects.length === 0) {
    return null
  }

  const nodes = isLoading
    ? range(0, ANNOTATED_OBJECTS_MAX).map((val) => (
        <Skeleton key={`skeleton-${val}`} variant="rounded" />
      ))
    : annotatedObjects.map((obj) => <li key={obj}>{obj}</li>)

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
            title={
              <Paper className="p-sds-m text-black w-[250px]" elevation={4}>
                <List className="font-semibold">
                  {nodes.slice(0, 4)}

                  <li>
                    really long object with a long name that is long for some
                    reason other than being long
                  </li>

                  {nodes.slice(4)}
                </List>
              </Paper>
            }
          >
            <div
              className={cns(
                'bg-sds-gray-200 text-sds-gray-600 hover:cursor-pointer',
                'text-sds-body-xxxs leading-sds-body-xxxs',
                'rounded-sds-m py-sds-xxxs px-sds-xs inline',
              )}
            >
              {i18n.nMoreObjects(nodes.length + 1 - ANNOTATED_OBJECTS_MAX)}
            </div>
          </Tooltip>
        </li>
      )}
    </List>
  )
}
