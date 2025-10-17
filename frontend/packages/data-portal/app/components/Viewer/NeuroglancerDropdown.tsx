import { Icon, MenuItem } from '@czi-sds/components'
import { ComponentProps, forwardRef } from 'react'

import {
  MenuDropdown,
  MenuDropdownProps,
  MenuDropdownRef,
} from 'app/components/MenuDropdown'
import { cns } from 'app/utils/cns'

export function NeuroglancerDropdownOption({
  selected,
  onSelect,
  children,
  title,
  subtitle,
  ...props
}: ComponentProps<typeof MenuItem> & {
  selected?: boolean
  onClick?: () => void
  title: React.ReactNode
  subtitle?: React.ReactNode
}) {
  return (
    <MenuItem
      {...props}
      onClick={onSelect}
      className="[&_.primary-text]:w-full"
    >
      <div className="flex items-center justify-center flex-auto gap-3 w-full">
        <div className="inline-flex w-4 h-4">
          {selected ? (
            <Icon sdsIcon="Check" sdsSize="s" className="!fill-[#0B68F8]" />
          ) : null}
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <span className={cns(selected && 'font-semibold')}>{title}</span>
            {subtitle && (
              <span
                className={cns(
                  'text-sds-body-xxxs-400-narrow text-light-sds-color-primitive-gray-600',
                  props.disabled && 'text-light-sds-color-primitive-gray-300',
                )}
              >
                {subtitle}
              </span>
            )}
          </div>
          {children}
        </div>
      </div>
    </MenuItem>
  )
}

export const NeuroglancerDropdown = forwardRef<
  MenuDropdownRef,
  MenuDropdownProps
>((props, ref) => {
  return (
    <MenuDropdown
      {...props}
      ref={ref}
      paperClassName="!min-w-[250px] !max-w-[380px]"
    />
  )
})
