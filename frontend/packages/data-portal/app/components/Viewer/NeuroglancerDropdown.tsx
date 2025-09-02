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
  ...props
}: ComponentProps<typeof MenuItem> & {
  selected?: boolean
  onClick?: () => void
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
        <div
          className={cns(
            selected && 'font-semibold',
            'flex',
            'flex-col',
            'w-full',
          )}
        >
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
