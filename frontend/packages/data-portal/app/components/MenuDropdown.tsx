import { Icon, Menu } from '@czi-sds/components'
import {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import { cns } from 'app/utils/cns'

import { MenuItemHeader } from './MenuItemHeader'

export type MenuDropdownRef = {
  closeMenu: () => void
}

export type MenuDropdownProps = {
  children: ReactNode
  variant?: 'standard' | 'outlined'
  className?: string
  title?: ReactNode
  buttonElement?: ReactNode
  paperClassName?: string
}

export const MenuDropdown = forwardRef<MenuDropdownRef, MenuDropdownProps>(
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
          className="!p-0 flex items-center gap-2"
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

    const buildOutlinedMenuButton = () => {
      return (
        <button
          className={cns(
            'border px-3.5 py-1.5 rounded-full flex items-center gap-2',
            anchorEl
              ? 'border-dark-sds-color-primitive-blue-700 bg-dark-sds-color-primitive-blue-700'
              : 'border-dark-sds-color-primitive-blue-600 group-hover:border-dark-sds-color-primitive-blue-700 group-hover:bg-dark-sds-color-primitive-blue-700',
          )}
          onClick={() => setAnchorEl(menuRef.current)}
          type="button"
        >
          <span
            ref={menuRef}
            className={cns(
              'font-semibold',

              anchorEl
                ? 'text-light-sds-color-primitive-gray-900'
                : 'text-dark-sds-color-primitive-blue-600 group-hover:text-light-sds-color-primitive-gray-900',
            )}
          >
            {title}
          </span>

          <Icon
            sdsIcon={anchorEl ? 'ChevronUp' : 'ChevronDown'}
            sdsSize="xs"
            className={cns(
              anchorEl
                ? '!w-[10px] !h-[10px] !fill-light-sds-color-primitive-gray-900'
                : '!w-[10px] !h-[10px] !fill-dark-sds-color-primitive-blue-600 group-hover:!fill-light-sds-color-primitive-gray-900',
            )}
          />
        </button>
      )
    }

    const buildIconOnlyMenuButton = () => {
      return (
        <button
          onClick={() => setAnchorEl(menuRef.current)}
          type="button"
          className={
            anchorEl
              ? '!fill-light-sds-color-primitive-gray-50'
              : '!fill-light-sds-color-primitive-gray-500 group-hover:!fill-light-sds-color-primitive-gray-50'
          }
        >
          <span ref={menuRef}>{buttonElement}</span>
        </button>
      )
    }

    const buildMenuButtonVariations = {
      standard: buildStandardMenuButton,
      outlined: buildOutlinedMenuButton,
    }

    return (
      <div className={cns(className, 'group')}>
        {title
          ? buildMenuButtonVariations[variant]()
          : buildIconOnlyMenuButton()}

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

export function MenuDropdownSection({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <div>
      {title && <MenuItemHeader>{title}</MenuItemHeader>}
      {children}
    </div>
  )
}
