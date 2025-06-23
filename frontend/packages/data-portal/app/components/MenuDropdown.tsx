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

    return (
      <div className={cns(className, 'group')}>
        {title ? (
          <button
            className={cns(
              'flex items-center gap-2',
              MENU_STYLES.button[variant].default,
              variant === 'outlined' &&
                (anchorEl
                  ? MENU_STYLES.button[variant].active
                  : cns(
                      MENU_STYLES.button[variant].inactive,
                      `group-hover:${MENU_STYLES.button[variant].active}`,
                    )),
            )}
            onClick={() => setAnchorEl(menuRef.current)}
            type="button"
          >
            <span
              ref={menuRef}
              className={cns(
                'font-semibold',
                anchorEl
                  ? MENU_STYLES.text[variant].active
                  : cns(
                      MENU_STYLES.text[variant].inactive,
                      `group-hover:${MENU_STYLES.text[variant].active}`,
                    ),
              )}
            >
              {title}
            </span>

            <Icon
              sdsIcon={anchorEl ? 'ChevronUp' : 'ChevronDown'}
              sdsSize="xs"
              className={cns(
                '!w-[10px] !h-[10px]',
                anchorEl
                  ? MENU_STYLES.icon[variant].active
                  : cns(
                      MENU_STYLES.icon[variant].inactive,
                      `group-hover:${MENU_STYLES.icon[variant].active}`,
                    ),
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
