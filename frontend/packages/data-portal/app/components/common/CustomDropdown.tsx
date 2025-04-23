import { ReactNode, ComponentProps } from 'react'
import { MenuDropdown } from 'app/components/MenuDropdown'
import { MenuItemHeader } from 'app/components/MenuItemHeader'
import { MenuItem, Icon } from '@czi-sds/components'
import { cns } from 'app/utils/cns'

type CustomDropdownProps = {
  className?: string
  title?: string
  variant?: 'standard' | 'outlined' | 'filled'
  buttonElement?: ReactNode
  children: ReactNode
}

export function CustomDropdownSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      {title && <MenuItemHeader>{title}</MenuItemHeader>}
      {children}
    </div>
  )
}

export function CustomDropdownOption({
  selected,
  onSelect,
  children,
  ...props
}: ComponentProps<typeof MenuItem> & {
  selected?: boolean
  onClick?: () => void
}) {
  return (
    <MenuItem {...props} onClick={onSelect} sx={{ "& .primary-text": { width: "100%" } }}>
      <div className="flex items-center justify-center flex-auto gap-3 w-full">
        <div className="inline-flex w-4 h-4">
          {selected ? (
            <Icon
              sdsIcon="Check"
              sdsType="button"
              sdsSize="s"
              className="!fill-[#0B68F8]"
            />
          ) : null}
        </div>
        <div className={cns(selected && 'font-semibold', 'flex flex-col w-full')}>
          {children}
        </div>
      </div>
    </MenuItem>
  )
}

export function CustomDropdown({
  className,
  title,
  variant = 'standard',
  buttonElement,
  children,
}: CustomDropdownProps) {
  return (
    <MenuDropdown
      className={className}
      title={title}
      variant={variant}
      buttonElement={buttonElement}
    >
      {children}
    </MenuDropdown>
  )
}
