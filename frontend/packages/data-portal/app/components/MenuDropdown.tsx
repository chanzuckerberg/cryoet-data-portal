import { Icon, Menu } from '@czi-sds/components'
import { ReactNode, useRef, useState } from 'react'

import { cns } from 'app/utils/cns'

export function MenuDropdown({
  children,
  className,
  title,
  variant = 'standard',
  buttonElement,
}: {
  children: ReactNode
  variant?: 'standard' | 'outlined' | 'filled'
  className?: string
  title: ReactNode
  buttonElement?: ReactNode
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const variantStyles = {
    standard: '!p-0',
    outlined: 'border border-[#A2C9FF] px-3.5 py-1.5 rounded-full',
    filled: 'bg-[#2573F4] px-3.5 py-1.5 rounded-full',
  }

  const iconStyles = {
    standard: anchorEl
      ? '!fill-sds-color-primitive-common-white'
      : '!fill-sds-color-primitive-gray-400 group-hover:!fill-sds-color-primitive-common-white',
    outlined: '!fill-[#A2C9FF]',
    filled: '!fill-sds-color-primitive-common-white',
  }

  const textStyles = {
    standard: anchorEl
      ? 'text-sds-color-primitive-common-white'
      : 'text-sds-color-primitive-gray-400 group-hover:text-sds-color-primitive-common-white',
    outlined: 'text-[#A2C9FF]',
    filled: '!fill-sds-color-primitive-common-white',
  }

  return (
    <div className={className}>
      {title ? (
        <button
          className={cns(
            'flex items-center gap-2 group',
            variantStyles[variant],
          )}
          onClick={() => setAnchorEl(menuRef.current)}
          type="button"
        >
          <span
            ref={menuRef}
            className={cns(
              'font-semibold',
              textStyles[variant],
              anchorEl
                ? 'text-sds-color-primitive-common-white'
                : 'text-sds-color-primitive-gray-400 group-hover:text-sds-color-primitive-common-white',
            )}
          >
            {title}
          </span>

          <Icon
            sdsIcon={anchorEl ? 'ChevronUp' : 'ChevronDown'}
            sdsSize="xs"
            sdsType="iconButton"
            className={cns(
              iconStyles[variant],
              anchorEl
                ? '!w-[10px] !h-[10px] !fill-sds-color-primitive-common-white'
                : '!w-[10px] !h-[10px] !fill-sds-color-primitive-gray-400 group-hover:!fill-sds-color-primitive-common-white',
            )}
          />
        </button>
      ) : (
        <button
          onClick={() => setAnchorEl(menuRef.current)}
          type="button"
          className="text-[#999] hover:text-sds-color-primitive-common-white"
        >
          <span ref={menuRef}>{buttonElement}</span>
        </button>
      )}

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
