import { Icon, Menu } from '@czi-sds/components'
import {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { cns } from 'app/utils/cns'

export type MenuDropdownRef = {
  closeMenu: () => void
}

export const MenuDropdown = forwardRef<
  MenuDropdownRef,
  {
    children: ReactNode
    variant?: 'standard' | 'outlined' | 'filled'
    className?: string
    title: ReactNode
    buttonElement?: ReactNode
    paperClassName?: string
  }
>(
  (
    {
      children,
      className,
      title,
      variant = 'standard',
      buttonElement,
      paperClassName,
    },
    ref,
  ) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      closeMenu: () => setAnchorEl(null),
    }))

    const variantStyles = {
      standard: '!p-0',
      outlined: 'border border-[#A2C9FF] px-3.5 py-1.5 rounded-full',
      filled: 'bg-[#2573F4] px-3.5 py-1.5 rounded-full',
    }

    const iconStyles = {
      standard: anchorEl
        ? '!text-light-sds-color-primitive-gray-400'
        : '!text-light-sds-color-primitive-gray-400 group-hover:!text-light-sds-color-primitive-gray-50',
      outlined: '!text-[#A2C9FF]',
      filled: '!fill-sds-color-primitive-common-white',
    }

    const textStyles = {
      standard: anchorEl
        ? 'text-light-sds-color-primitive-gray-400'
        : 'text-light-sds-color-primitive-gray-400 group-hover:text-light-sds-color-primitive-gray-50',
      outlined: '!text-[#A2C9FF]',
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
              className={cns('font-semibold', textStyles[variant])}
            >
              {title}
            </span>

            <Icon
              sdsIcon={anchorEl ? 'ChevronUp' : 'ChevronDown'}
              sdsSize="xs"
              className={cns(iconStyles[variant], '!w-[10px] !h-[10px]')}
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
          slotProps={{
            paper: {
              className: paperClassName,
            },
          }}
        >
          {children}
        </Menu>
      </div>
    )
  },
)
