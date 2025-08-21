import { useSearchParams } from '@remix-run/react'
import { isEqual } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'

import { PrefixValueProvider } from 'app/components/AnnotationFilter/ObjectIdFilter/PrefixValueContext'
import { PrefixOptionFilter } from 'app/components/Filters/PrefixOptionFilter'
import { Select, SelectOption } from 'app/components/Select'
import { GO, UNIPROTKB } from 'app/constants/annotationObjectIdLinks'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'
import { isFilterPrefixValid, removeIdPrefix } from 'app/utils/idPrefixes'
import { arrayToString, stringToArray } from 'app/utils/string'

import { BooleanFilter } from '../BooleanFilter'
import { DropdownFilterButton } from '../DropdownFilterButton/DropdownFilterButton'

export interface InputFilterData {
  id: string
  label: string
  queryParam: QueryParams
  hideLabel?: boolean
  placeholder?: string
}

export function stringArrayToSelectOptions(strings: string[]): SelectOption[] {
  return strings.map((str) => ({
    key: str,
    value: str,
    label: str,
  }))
}

export interface ObjectNameIdFilterProps {
  label: string
  objectNames: string[]
  showAnnotatedObjectsOnly?: boolean
}

const prefixOptions = [
  {
    id: 'go',
    name: 'GO ID',
    details: 'Gene Ontology ID',
    link: GO,
    prefix: 'GO:',
    placeholder: '0016020 or GO:0016020',
  },
  {
    id: 'uniprotkb',
    name: 'UniProtKB',
    details: 'The UniProt Knowledgebase',
    link: UNIPROTKB,
    prefix: 'UniProtKB:',
    placeholder: 'P01267 or UniProtKB:P01267',
  },
]
export function ObjectNameIdFilter({
  label,
  objectNames,
  showAnnotatedObjectsOnly = true,
}: ObjectNameIdFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useI18n()

  const filters = useMemo<InputFilterData[]>(() => {
    const baseFilters = [
      {
        id: QueryParams.ObjectName,
        label: `${t('objectName')}:`,
        queryParam: QueryParams.ObjectName,
      },
      {
        id: QueryParams.ObjectId,
        label: `${t('objectId')}:`,
        queryParam: QueryParams.ObjectId,
      },
    ]

    if (showAnnotatedObjectsOnly) {
      baseFilters.push({
        id: QueryParams.AnnotatedObjectsOnly,
        label: t('annotatedObjectsOnly'),
        queryParam: QueryParams.AnnotatedObjectsOnly,
      })
    }

    return baseFilters
  }, [t, showAnnotatedObjectsOnly])

  const getQueryParamValues = useCallback(
    () =>
      Object.fromEntries(
        filters.map((filter) => {
          if (filter.queryParam === QueryParams.ObjectName) {
            // Handle multiple object name query parameters
            const allValues = searchParams.getAll(filter.queryParam)
            return [filter.id, arrayToString(allValues)]
          }
          return [filter.id, searchParams.get(filter.queryParam) ?? '']
        }),
      ),
    [filters, searchParams],
  )

  const [values, setValues] = useState(getQueryParamValues)

  const isDisabled = useMemo(() => {
    const hasInvalidPrefix = !!filters.find(
      (filter) => !isFilterPrefixValid(values[filter.id], filter.queryParam),
    )

    return hasInvalidPrefix || isEqual(values, getQueryParamValues())
  }, [filters, getQueryParamValues, values])

  return (
    <DropdownFilterButton
      activeFilters={filters
        .filter((filter) => searchParams.has(filter.queryParam))
        .flatMap((filter) => {
          const value = values[filter.id]

          // For ObjectName filter, split comma-separated values into individual tags
          if (filter.queryParam === QueryParams.ObjectName && value) {
            return stringToArray(value).map((name) => ({
              label: filters.length > 1 ? filter.label : '',
              value: name,
              queryParam: filter.queryParam,
            }))
          }

          // For other filters, return single tag
          return [
            {
              label: filters.length > 1 ? filter.label : '',
              value,
              queryParam: filter.queryParam,
            },
          ]
        })}
      description={
        <>
          <p className="text-sds-header-s-600-wide leading-sds-header-s font-semibold">
            {t('filterByAnyOfTheFollowing')}:
          </p>
        </>
      }
      label={label}
      onApply={() =>
        setSearchParams(
          (prev) => {
            filters.forEach((filter) => {
              prev.delete(filter.queryParam)
              const value = values[filter.id]

              if (value) {
                // Handle ObjectId with prefix removal
                if (filter.queryParam === QueryParams.ObjectId) {
                  prev.set(
                    filter.queryParam,
                    removeIdPrefix(value, filter.queryParam) ?? '',
                  )
                } else if (filter.queryParam === QueryParams.ObjectName) {
                  // Handle ObjectName with multiple values as separate query params
                  stringToArray(value).forEach((name) => {
                    prev.append(filter.queryParam, name)
                  })
                } else {
                  prev.set(filter.queryParam, value)
                }
              }
            })

            prev.delete(QueryParams.Page)
            return prev
          },
          { preventScrollReset: true },
        )
      }
      onCancel={() => setValues(getQueryParamValues())}
      onRemoveFilter={(filterToRemove) => {
        const filter = filters.find(
          ({ queryParam }) => queryParam === filterToRemove.queryParam,
        )

        if (!filter) {
          return
        }

        // For ObjectName filter, remove specific value from comma-separated list
        if (filter.queryParam === QueryParams.ObjectName) {
          const currentValues = stringToArray(values[filter.id])
          const updatedValues = currentValues.filter(
            (name) => name !== filterToRemove.value,
          )
          const newValue = arrayToString(updatedValues)
          setValues((prev) => ({
            ...prev,
            [filter.id]: newValue,
          }))

          setSearchParams(
            (prev) => {
              // Remove all existing object name params
              prev.delete(filter.queryParam)
              // Add back the remaining values as separate query params
              if (newValue) {
                const remainingNames = stringToArray(newValue)
                remainingNames.forEach((name) => {
                  prev.append(filter.queryParam, name)
                })
              }
              return prev
            },
            { preventScrollReset: true },
          )
        } else {
          // For other filters, clear completely
          setValues((prev) => ({
            ...prev,
            [filter.id]: '',
          }))

          setSearchParams(
            (prev) => {
              prev.delete(filter.queryParam)
              return prev
            },
            { preventScrollReset: true },
          )
        }
      }}
      disabled={isDisabled}
    >
      <div className="flex flex-col gap-sds-l mt-sds-xs">
        <Select
          multiple
          title={
            <span className="text-sds-body-xs-600-wide leading-sds-body-xs">
              {t('objectName')}{' '}
              <span className="text-sds-body-xs-400-wide font-normal text-light-sds-color-semantic-base-text-secondary">
                (multi-select)
              </span>
            </span>
          }
          className="gap-sds-xxxs"
          dropdownClasses={{
            popper: 'max-h-[325px] !p-sds-xs overflow-y-auto',
            listbox: '!pr-0',
          }}
          dropdownPopperBaseProps={{
            className: '!p-0',
          }}
          activeKeys={stringToArray(values[QueryParams.ObjectName])}
          search
          label={t('objectName')}
          options={stringArrayToSelectOptions(objectNames)}
          onChange={(selectedKeys) =>
            setValues((prev) => ({
              ...prev,
              [QueryParams.ObjectName]: arrayToString(selectedKeys),
            }))
          }
          showActiveValue
          showDetails={false}
        />

        <PrefixValueProvider initialOptions={prefixOptions}>
          <div>
            <p className="text-sds-body-xs-600-wide leading-sds-body-xs font-semibold pb-sds-xxxs">
              {t('objectId')}{' '}
              <span className="text-sds-body-xs-400-wide font-normal text-light-sds-color-semantic-base-text-secondary">
                (one ID only):
              </span>
            </p>

            <PrefixOptionFilter
              // Use local state instead of separate state
              value={values[QueryParams.ObjectId]}
              id="object-id-input"
              label={label}
              // Update local state instead of separate state
              onChange={(newValue) =>
                setValues((prev) => ({
                  ...prev,
                  [QueryParams.ObjectId]: newValue,
                }))
              }
              prefixOptions={prefixOptions}
              hideLabel
              // Use the unified disabled logic
              error={!!values[QueryParams.ObjectId] && isDisabled}
            />
          </div>
        </PrefixValueProvider>
        {showAnnotatedObjectsOnly && (
          <>
            <div className="border-light-sds-color-primitive-gray-300 border" />
            <BooleanFilter
              label={t('annotatedObjectsOnly')}
              value={values[QueryParams.AnnotatedObjectsOnly] === 'Yes'}
              onChange={(checked) => {
                setValues((prev) => ({
                  ...prev,
                  [QueryParams.AnnotatedObjectsOnly]: checked ? 'Yes' : '',
                }))
              }}
            />
          </>
        )}
      </div>
    </DropdownFilterButton>
  )
}
