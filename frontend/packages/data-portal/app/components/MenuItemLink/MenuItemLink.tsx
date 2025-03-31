import { MenuItem } from '@czi-sds/components'
import { ComponentProps } from 'react'

import { Link } from 'app/components/Link'

import styles from './MenuItemLink.module.css'

export function MenuItemLink({
  divider,
  ...props
}: ComponentProps<typeof Link> & {
  divider?: boolean
}) {
  return (
    <MenuItem className={styles.menuItem} divider={divider}>
      <Link className="flex flex-auto !text-sds-body-xs-400-wide" {...props} />
    </MenuItem>
  )
}
