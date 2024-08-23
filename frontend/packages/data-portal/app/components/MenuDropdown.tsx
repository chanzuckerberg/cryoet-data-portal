import { Icon, Menu } from '@czi-sds/components'
import { ReactNode, useState } from 'react'

import { cns } from 'app/utils/cns'

export function MenuDropdown({
  children,
  className,
  title,
}: {
  children: ReactNode
  className?: string
  title: ReactNode
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  return (
    <div className={className}>
      <button
        className="!p-0 flex items-center gap-2 group"
        onClick={(event) => setAnchorEl(event.target as HTMLElement | null)}
        type="button"
      >
        <span
          className={cns(
            anchorEl
              ? 'text-sds-gray-white'
              : 'text-sds-gray-400 group-hover:text-sds-gray-white',
          )}
        >
          {title}
        </span>

        <Icon
          sdsIcon={anchorEl ? 'ChevronUp' : 'ChevronDown'}
          sdsSize="xs"
          sdsType="iconButton"
          className={cns(
            anchorEl
              ? '!w-[10px] !h-[10px] !fill-sds-gray-white'
              : '!w-[10px] !h-[10px] !fill-sds-gray-400 group-hover:!fill-sds-gray-white',
          )}
        />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        className="mt-2"
      >
        {children}
      </Menu>
    </div>
  )
}
