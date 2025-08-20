import { Button, Icon } from '@czi-sds/components'
// eslint-disable-next-line cryoet-data-portal/no-root-mui-import
import { Popover } from '@mui/material'
import { ReactNode, useMemo, useRef, useState } from 'react'

import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { ActiveDropdownFilterData } from './components/FilterChips/FilterChips'

export interface DropdownFilterButtonProps {
  activeFilters: ActiveDropdownFilterData[]
  children: ReactNode
  description?: ReactNode
  disabled?: boolean
  label: string
  onApply(): void
  onCancel(): void
  onOpen?(): void
  onRemoveFilter(filter: ActiveDropdownFilterData): void
}

function groupFiltersByLabel(filters: ActiveDropdownFilterData[]) {
  return filters.reduce(
    (acc, filter) => {
      const key = filter.label || 'default'
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(filter)
      return acc
    },
    {} as Record<string, ActiveDropdownFilterData[]>,
  )
}

export function DropdownFilterButton({
  activeFilters,
  children,
  description,
  disabled,
  label,
  onApply,
  onCancel,
  onOpen,
  onRemoveFilter,
}: DropdownFilterButtonProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { t } = useI18n()

  // Memoize the grouped filters to avoid recalculating on every render
  const groupedFilters = useMemo(
    () => groupFiltersByLabel(activeFilters),
    [activeFilters],
  )

  return (
    <div>
      <Button
        sdsStyle="minimal"
        className={cns(
          'flex items-center gap-sds-xs group',
          open && '!bg-light-sds-color-primitive-gray-100',
        )}
        ref={buttonRef}
        onClick={() => {
          setOpen((prev) => !prev)
          onOpen?.()
        }}
      >
        <span
          className={cns(
            'font-semibold group-hover:text-black transition-colors text-sm',
            open ? 'text-black' : 'text-light-sds-color-primitive-gray-600',
          )}
        >
          {label}
        </span>

        <Icon
          className={cns(
            'group-hover:!fill-black transition-colors',
            open ? '!fill-black' : '!fill-light-sds-color-primitive-gray-600',
          )}
          sdsIcon="ChevronDown"
          sdsSize="xs"
        />
      </Button>

      {activeFilters.length > 0 && (
        <div className="flex flex-col gap-sds-xs">
          {/* <FilterChips
            groupedFilters={groupedFilters}
            onRemoveFilter={onRemoveFilter}
          /> */}
          {activeFilters.map((filter) => {
            return (
              <div
                key={`${filter.value}-${filter.queryParam}-${filter.label}`}
                className="pl-sds-s flex flex-col"
              >
                {filter.label && (
                  <p className="text-sds-body-xs-400-wide leading-sds-body-xs text-light-sds-color-primitive-gray-500 uppercase">
                    {filter.label}
                  </p>
                )}

                <div>
                  <div className="bg-light-sds-color-primitive-blue-600 rounded-sds-m py-sds-xxs px-sds-s inline-flex items-center gap-sds-s">
                    <span className="text-sds-body-xs-400-wide leading-sds-body-xs font-semibold text-white">
                      {getPrefixedId(filter.value, filter.queryParam)}
                    </span>

                    <Button
                      className="!min-w-0 !w-0"
                      onClick={() => onRemoveFilter(filter)}
                      aria-label="remove-filter"
                      sdsStyle="minimal"
                    >
                      <Icon
                        className="!fill-white !w-[10px] !h-[10px]"
                        sdsIcon="XMark"
                        sdsSize="xs"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Popover
        anchorEl={buttonRef.current}
        open={open}
        anchorOrigin={{ vertical: 40, horizontal: 'left' }}
      >
        <div className="px-sds-l py-sds-default min-w-[278px] max-w-[350px] flex flex-col">
          {description}
          {children}

          <div className="flex items-center justify-stretch gap-sds-default mt-sds-l">
            <Button
              className="w-full"
              disabled={disabled}
              sdsType="primary"
              sdsStyle="square"
              onClick={() => {
                onApply()
                setOpen(false)
              }}
            >
              {t('apply')}
            </Button>

            <Button
              className="w-full"
              sdsType="secondary"
              sdsStyle="square"
              onClick={() => {
                onCancel()
                setOpen(false)
              }}
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </Popover>
    </div>
  )
}
