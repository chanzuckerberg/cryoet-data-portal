import { useEffect, useMemo, useState } from 'react'

import {
  FilterSection,
  GroundTruthAnnotationFilter,
  SelectFilter,
} from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { i18n } from 'app/i18n'
import {
  AvailableFilesFilterOption,
  NumberOfRunsFilterOption,
} from 'app/types/filter'

import { AVAILABLE_FILES_VALUE_TO_I18N_MAP } from './constants'

const NUMBER_OF_RUN_OPTIONS: NumberOfRunsFilterOption[] = [
  { value: '>1' },
  { value: '>5' },
  { value: '>10' },
  { value: '>20' },
  { value: '>100' },
]

const AVAILABLE_FILES_CLASS_NAME = 'select-available-files'
const MEETS_ALL_LABEL_ID = 'meets-all'

export function IncludedContentsFilterSection({
  depositionPageVariant,
}: {
  depositionPageVariant?: boolean
}) {
  const {
    updateValue,
    includedContents: { availableFiles, numberOfRuns },
  } = useFilter()
  const { t } = useI18n()

  const allAvailableFilesOptions = useMemo(
    () =>
      Object.entries(AVAILABLE_FILES_VALUE_TO_I18N_MAP).map(
        ([value, i18nKey]) =>
          ({
            value,
            label: t(i18nKey),
          }) as AvailableFilesFilterOption,
      ),
    [t],
  )

  const availableFilesOptions = useMemo(
    () =>
      availableFiles.map(
        (option) =>
          ({
            value: option,
            label: t(AVAILABLE_FILES_VALUE_TO_I18N_MAP[option]),
          }) as AvailableFilesFilterOption,
      ),
    [availableFiles, t],
  )

  const numberOfRunsOptions = useMemo(
    () =>
      numberOfRuns
        ? (NUMBER_OF_RUN_OPTIONS.find(({ value }) => value === numberOfRuns) ??
          null)
        : null,
    [numberOfRuns],
  )

  const [showMeetsAll, setShowMeetsAll] = useState(availableFiles.length > 0)

  // Really hacky way to get a label to show above the selected chips for the
  // SDS ComplexFilter component. We need to do this because the SDS does not
  // yet provide a way to add a label.
  // TODO Update upstream component to support chip labels
  useEffect(() => {
    const meetsAllNode = document.getElementById(
      MEETS_ALL_LABEL_ID,
    ) as HTMLSpanElement | null

    if (showMeetsAll && !meetsAllNode) {
      const filterButtonNode = document.querySelector(
        `.${AVAILABLE_FILES_CLASS_NAME} > button`,
      )

      const meetsAll = document.createElement('div')
      meetsAll.id = MEETS_ALL_LABEL_ID
      meetsAll.textContent = `${t('meetsAll')}:`

      filterButtonNode?.insertAdjacentElement('afterend', meetsAll)
    } else if (!showMeetsAll && meetsAllNode) {
      meetsAllNode.remove()
    }
  }, [showMeetsAll, t])

  return (
    <FilterSection
      title={
        depositionPageVariant ? i18n.depositionContents : i18n.datasetContents
      }
    >
      <SelectFilter
        multiple
        options={allAvailableFilesOptions}
        value={availableFilesOptions}
        label={i18n.dataTypes}
        onChange={(options) => {
          setShowMeetsAll((options?.length ?? 0) > 0)
          updateValue(QueryParams.AvailableFiles, options)
        }}
        title={`${t('resultsMustIncludeAllFileTypes')}:`}
        className={AVAILABLE_FILES_CLASS_NAME}
      />

      <GroundTruthAnnotationFilter
        depositionPageVariant={depositionPageVariant}
      />

      <SelectFilter
        options={NUMBER_OF_RUN_OPTIONS}
        value={numberOfRunsOptions}
        label={i18n.numberOfRuns}
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
