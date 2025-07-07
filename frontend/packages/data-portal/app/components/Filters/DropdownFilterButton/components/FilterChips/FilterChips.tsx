import { Button, Icon } from '@czi-sds/components'

import { QueryParams } from 'app/constants/query'
import { getPrefixedId } from 'app/utils/idPrefixes'

export interface ActiveDropdownFilterData {
  label?: string
  queryParam?: QueryParams
  value: string
}

export function FilterChips({
  groupedFilters,
  onRemoveFilter,
}: {
  groupedFilters: Record<string, ActiveDropdownFilterData[]>
  onRemoveFilter: (filter: ActiveDropdownFilterData) => void
}) {
  return (
    <>
      {Object.entries(groupedFilters).map(([groupLabel, filters]) => (
        <div key={groupLabel} className="pl-sds-s flex flex-col">
          {groupLabel !== 'default' && groupLabel && (
            <p className="text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs text-light-sds-color-primitive-gray-500 uppercase mb-sds-xxs">
              {groupLabel}
            </p>
          )}

          <div className="flex flex-wrap gap-sds-xxs">
            {filters.map((filter) => (
              <div
                key={`${filter.value}-${filter.queryParam}-${filter.label}`}
                className="bg-light-sds-color-semantic-accent-fill-primary rounded-sds-m py-sds-xxs px-sds-s mr-sds-m inline-flex items-center gap-sds-s hover:bg-light-sds-color-primitive-blue-600 hover:cursor-pointer transition-colors"
              >
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
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
