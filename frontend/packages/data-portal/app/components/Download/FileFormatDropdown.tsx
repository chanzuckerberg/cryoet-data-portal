import { AutocompleteClasses } from '@mui/material/Autocomplete'
import { useMemo } from 'react'

import { I18n } from 'app/components/I18n'
import { Select, SelectOption } from 'app/components/Select'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { I18nKeys } from 'app/types/i18n'
import { cns } from 'app/utils/cns'

export const FILE_FORMAT_LABEL_I18N: Record<string, I18nKeys> = {
  mrc: 'fileMrc',
  zarr: 'fileOmeZarr',
  ndjson: 'fileNdJson',
}

const FILE_FORMAT_TOOLTIP_I18N: Record<string, I18nKeys> = {
  mrc: 'fileFormatTooltipMrc',
  zarr: 'fileFormatTooltipZarr',
  ndjson: 'fileFormatTooltipNdJson',
}

export const FILE_FORMAT_ORDER = ['mrc', 'zarr', 'ndjson']
export function getDefaultFileFormat(
  availableFormats: string[],
): string | undefined {
  for (const fileFormat of FILE_FORMAT_ORDER) {
    if (availableFormats.includes(fileFormat)) {
      return fileFormat
    }
  }

  return undefined
}

/**
 * Renders select dropdown with file formats specified in the `fileFormats`
 * prop. The only allowed file formats so far are `.mrc`, `.zarr` and `.ndjson`.
 */
export function FileFormatDropdown({
  fileFormats,
  className,
  selectDropdownClasses,
}: {
  fileFormats: string[]
  className?: string
  selectDropdownClasses?: Partial<AutocompleteClasses>
}) {
  const { t } = useI18n()
  const { fileFormat, setFileFormat } = useDownloadModalQueryParamState()

  const matchingFileFormats = FILE_FORMAT_ORDER.filter((format) =>
    fileFormats.includes(format),
  )

  const fileFormatOptions = useMemo<SelectOption[]>(
    () =>
      matchingFileFormats.map((format) => ({
        key: format,
        value: format,
        label: t(FILE_FORMAT_LABEL_I18N[format]),
      })),
    [matchingFileFormats, t],
  )

  const selectedFormat =
    fileFormat ?? getDefaultFileFormat(matchingFileFormats)!

  return (
    <Select
      activeKey={selectedFormat}
      className={cns('flex-grow', className)}
      dropdownClasses={selectDropdownClasses}
      label={selectedFormat ? t(FILE_FORMAT_LABEL_I18N[selectedFormat]) : '--'}
      onChange={setFileFormat}
      options={fileFormatOptions}
      showActiveValue={false}
      showDetails={false}
      title={t('fileFormat')}
      tooltip={
        <div className="flex flex-col gap-sds-xxs">
          {matchingFileFormats.map((format) => (
            <p key={format}>
              <I18n i18nKey={FILE_FORMAT_TOOLTIP_I18N[format]} />
            </p>
          ))}
        </div>
      }
      tooltipProps={{
        classes: {
          tooltip: 'min-w-[300px]',
        },
        placement: 'top',
      }}
    />
  )
}
