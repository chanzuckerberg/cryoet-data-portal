import { Icon, MenuItem } from '@czi-sds/components'
import React, { ComponentProps, ReactNode, useRef } from 'react'

import { MenuDropdown, MenuDropdownRef } from 'app/components/MenuDropdown'
import { MenuItemHeader } from 'app/components/MenuItemHeader'
import { cns } from 'app/utils/cns'

type CustomDropdownProps = {
  className?: string
  title?: string
  variant?: 'standard' | 'outlined'
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

export function CustomDropdown({
  className,
  title,
  variant = 'standard',
  buttonElement,
  children,
}: CustomDropdownProps) {
  const dropdownRef = useRef<MenuDropdownRef>(null)

  // Recursively wraps children with a click handler that closes the dropdown
  const wrapChildrenWithCloseHandler = (
    inputChildren: ReactNode,
  ): ReactNode => {
    return React.Children.map(inputChildren, (child) => {
      if (!React.isValidElement(child)) return child
      const typedChild = child as React.ReactElement<{
        type: string
        onClick?: (e: React.MouseEvent) => void
        props: {
          onClick?: (e: React.MouseEvent) => void
        }
        children?: ReactNode
      }>
      if (typedChild.type === 'button' && typedChild.props.onClick) {
        return React.cloneElement(typedChild, {
          onClick: (e: React.MouseEvent) => {
            typedChild.props.onClick!(e)
            dropdownRef.current?.closeMenu()
          },
        })
      }

      if (typedChild.props.children) {
        return React.cloneElement(typedChild, {
          children: wrapChildrenWithCloseHandler(typedChild.props.children),
        })
      }

      return typedChild
    })
  }

  return (
    <MenuDropdown
      ref={dropdownRef}
      className={className}
      title={title}
      variant={variant}
      buttonElement={buttonElement}
      paperClassName="!min-w-[250px] !max-w-[380px]"
    >
      {wrapChildrenWithCloseHandler(children)}
    </MenuDropdown>
  )
}
