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

const MENU_STYLES = {
  button: {
    standard: {
      default: '!p-0',
    },
    outlined: {
      default: 'border px-3.5 py-1.5 rounded-full',
      active: 'border-white',
      inactive: 'border-black',
    },
  },
  text: {
    standard: {
      active: 'text-light-sds-color-primitive-gray-50',
      inactive: 'text-light-sds-color-primitive-gray-400',
    },
    outlined: {
      active: 'text-black',
      inactive: 'text-dark-sds-color-primitive-gray-600',
    },
  },
  icon: {
    standard: {
      active: '!fill-light-sds-color-primitive-gray-50',
      inactive: '!fill-light-sds-color-primitive-gray-400',
    },
    outlined: {
      active: '!fill-black',
      inactive: '!fill-dark-sds-color-primitive-gray-600',
    },
  },
}

export const MenuDropdown = forwardRef<
  MenuDropdownRef,
  {
    children: ReactNode
    variant?: 'standard' | 'outlined'
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

    const buildStandardMenuButton = () => {
      return (
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
      )
    }

    const buildMenuButtonVariations = {
      standard: buildStandardMenuButton,
      outlined: buildStandardMenuButton
    }

    return (
      <div className={className}>
        {title ? buildMenuButtonVariations[variant]() : buttonElement}

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
