import { Icon, MenuItem } from '@czi-sds/components'
import { ComponentProps, } from 'react'

import { MenuDropdown, MenuDropdownProps } from 'app/components/MenuDropdown'
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
      sx={{ '& .primary-text': { width: '100%' } }}
    >
      <div className="flex items-center justify-center flex-auto gap-3 w-full">
        <div className="inline-flex w-4 h-4">
          {selected ? (
            <Icon sdsIcon="Check" sdsSize="s" className="!fill-[#0B68F8]" />
          ) : null}
        </div>
        <div
          className={cns(selected && 'font-semibold', 'flex flex-col w-full')}
        >
          {children}
        </div>
      </div>
    </MenuItem>
  )
}

export function NeuroglancerDropdown({
  className,
  title,
  variant = 'standard',
  buttonElement,
  children,
}: MenuDropdownProps) {
  return (
    <MenuDropdown
      className={className}
      title={title}
      variant={variant}
      buttonElement={buttonElement}
      paperClassName="!min-w-[250px] !max-w-[380px]"
    >
      {children}
    </MenuDropdown>
  )
}
