import { useMemo } from 'react'

import { DataTypesFilter } from 'app/components/Filters/DataTypesFilter'
import { FilterSection } from 'app/components/Filters/FilterSection'
import { GroundTruthAnnotationFilter } from 'app/components/Filters/GroundTruthAnnotationFilter'
import { SelectFilter } from 'app/components/Filters/SelectFilter'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { NumberOfRunsFilterOption } from 'app/types/filter'

const NUMBER_OF_RUN_OPTIONS: NumberOfRunsFilterOption[] = [
  { value: '>1' },
  { value: '>5' },
  { value: '>10' },
  { value: '>20' },
  { value: '>100' },
]

export function IncludedContentsFilterSection({
  depositionPageVariant,
}: {
  depositionPageVariant?: boolean
}) {
  const {
    updateValue,
    includedContents: { numberOfRuns },
  } = useFilter()
  const { t } = useI18n()

  const numberOfRunsOptions = useMemo(
    () =>
      numberOfRuns
        ? NUMBER_OF_RUN_OPTIONS.find(({ value }) => value === numberOfRuns) ??
          null
        : null,
    [numberOfRuns],
  )

  return (
    <FilterSection
      title={
        depositionPageVariant ? t('depositionContents') : t('datasetContents')
      }
    >
      <DataTypesFilter />

      <GroundTruthAnnotationFilter
        depositionPageVariant={depositionPageVariant}
      />

      <SelectFilter
        options={NUMBER_OF_RUN_OPTIONS}
        value={numberOfRunsOptions}
        label={t('numberOfRuns')}
        onChange={(option) =>
          updateValue(
            QueryParams.NumberOfRuns,
            option ? JSON.stringify(option.value) : null,
          )
        }
        details={
          depositionPageVariant ? (
            <p className="text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-primitive-gray-500">
              {t('withDepositionData')}
            </p>
          ) : undefined
        }
      />
    </FilterSection>
  )
}
