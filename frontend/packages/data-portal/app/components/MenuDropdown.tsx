import { Icon, Menu } from '@czi-sds/components'
import { ReactNode, useRef, useState } from 'react'

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
  const menuRef = useRef<HTMLDivElement>(null)

  return (
    <div className={className}>
      <button
        className="!p-0 flex items-center gap-2 group"
        onClick={() => setAnchorEl(menuRef.current)}
        type="button"
      >
        <span
          ref={menuRef}
          className={cns(
            'font-semibold',

            anchorEl
              ? 'text-light-sds-color-primitive-gray-50'
              : 'text-light-sds-color-primitive-gray-400 group-hover:text-light-sds-color-primitive-gray-50',
          )}
        >
          {title}
        </span>

        <Icon
          sdsIcon={anchorEl ? 'ChevronUp' : 'ChevronDown'}
          sdsSize="xs"
          className={cns(
            anchorEl
              ? '!w-[10px] !h-[10px] !fill-light-sds-color-primitive-gray-50'
              : '!w-[10px] !h-[10px] !fill-light-sds-color-primitive-gray-400 group-hover:!fill-light-sds-color-primitive-gray-50',
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
