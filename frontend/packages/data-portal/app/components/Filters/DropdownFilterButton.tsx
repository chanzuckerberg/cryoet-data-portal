import { Button, Icon } from '@czi-sds/components'
import Popover from '@mui/material/Popover'
import { ReactNode, useRef, useState } from 'react'

import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

export interface ActiveDropdownFilterData {
  value: string
  label?: string
}

export function DropdownFilterButton({
  activeFilters,
  children,
  description,
  disabled,
  label,
  onApply,
  onCancel,
  onRemoveFilter,
}: {
  activeFilters: ActiveDropdownFilterData[]
  children: ReactNode
  description: ReactNode
  disabled?: boolean
  label: string
  onApply(): void
  onCancel(): void
  onRemoveFilter(filter: ActiveDropdownFilterData): void
}) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <div>
      {/* Filter button  */}
      <Button
        className={cns(
          'flex items-center gap-sds-xs group',
          open && '!bg-sds-gray-100',
        )}
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={cns(
            'font-semibold group-hover:text-black transition-colors',
            open ? 'text-black' : 'text-sds-gray-500',
          )}
        >
          {label}
        </span>

        <Icon
          className={cns(
            'group-hover:!fill-black transition-colors',
            open ? '!fill-black' : '!fill-sds-gray-500',
          )}
          sdsIcon="chevronDown"
          sdsSize="s"
          sdsType="button"
        />
      </Button>

      {/* active filter chips  */}
      {activeFilters.length > 0 && (
        <div className="flex flex-col gap-sds-xs">
          {activeFilters.map((filter) => (
            <div className="pl-sds-s flex flex-col">
              {filter.label && (
                <p className="text-sds-body-xs leading-sds-body-xs text-sds-gray-500 uppercase">
                  {filter.label}
                </p>
              )}

              <div>
                <div className="bg-sds-primary-400 rounded-sds-m py-sds-xxs px-sds-s inline-flex items-center gap-sds-s">
                  <span className="text-sds-body-xs leading-sds-body-xs font-semibold text-white">
                    {filter.value}
                  </span>

                  <Button
                    className="!min-w-0 !w-0"
                    onClick={() => onRemoveFilter(filter)}
                  >
                    <Icon
                      className="!fill-white !w-[10px] !h-[10px]"
                      sdsIcon="xMark"
                      sdsSize="xs"
                      sdsType="static"
                    />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* filter popup */}
      <Popover
        anchorEl={buttonRef.current}
        open={open}
        anchorOrigin={{ vertical: 40, horizontal: 'left' }}
      >
        <div className="px-sds-l py-sds-default min-w-[278px] max-w-[320px] flex flex-col">
          {description}
          {children}

          <div className="flex items-center gap-sds-default mt-5">
            <Button
              disabled={disabled}
              sdsType="primary"
              sdsStyle="square"
              onClick={() => {
                onApply()
                setOpen(false)
              }}
            >
              {i18n.apply}
            </Button>

            <Button
              sdsType="secondary"
              sdsStyle="square"
              onClick={() => {
                onCancel()
                setOpen(false)
              }}
            >
              {i18n.cancel}
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  )
}
