import { useMemo } from 'react'

import { SelectFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { AvailableFilesFilterOption } from 'app/types/filter'

import { AVAILABLE_FILES_VALUE_TO_I18N_MAP } from './constants'

const AVAILABLE_FILES_CLASS_NAME = 'select-available-files'

export function DataTypesFilter() {
  const {
    updateValue,
    includedContents: { availableFiles },
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

  return (
    <SelectFilter
      multiple
      options={allAvailableFilesOptions}
      value={availableFilesOptions}
      label={t('dataTypes')}
      onChange={(options) => {
        updateValue(QueryParams.AvailableFiles, options)
      }}
      title={`${t('resultsMustIncludeAllFileTypes')}:`}
      className={AVAILABLE_FILES_CLASS_NAME}
    />
  )
}
