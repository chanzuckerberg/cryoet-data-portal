import { Icon } from '@czi-sds/components'
import { LinkProps } from '@remix-run/react'

import { cns } from 'app/utils/cns'

import { Link } from '../Link'

export function TableLink({ children, ...props }: LinkProps) {
  return (
    <Link {...props}>
      <span>{children} </span>

      <span
        className={cns(
          'hidden group-hover:inline-flex',
          '[&_svg]:text-sds-color-semantic-text-action-hover',
        )}
      >
        <Icon sdsIcon="ChevronRight" sdsSize="xs" />
      </span>
    </Link>
  )
}
