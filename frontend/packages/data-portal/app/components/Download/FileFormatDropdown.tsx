import { useMemo } from 'react'

import { I18n } from 'app/components/I18n'
import { Select, SelectOption } from 'app/components/Select'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { I18nKeys } from 'app/types/i18n'

const FILE_FORMAT_LABEL_I18N: Record<string, I18nKeys> = {
  '.mrc': 'fileMrc',
  '.zarr': 'fileOmeZarr',
  '.ndjson': 'fileNdJson',
}

const FILE_FORMAT_TOOLTIP_I18N: Record<string, I18nKeys> = {
  '.mrc': 'fileFormatTooltipMrc',
  '.zarr': 'fileFormatTooltipZarr',
  '.ndjson': 'fileFormatTooltipNdJson',
}

const FILE_FORMAT_ORDER = ['.mrc', '.zarr', '.ndjson']

/**
 * Renders select dropdown with file formats specified in the `fileFormats`
 * prop. The only allowed file formats so far are `.mrc`, `.zarr` and `.ndjson`.
 */
export function FileFormatDropdown({ fileFormats }: { fileFormats: string[] }) {
  const { t } = useI18n()
  const { fileFormat, setFileFormat } = useDownloadModalQueryParamState()

  const fileFormatOptions = useMemo<SelectOption[]>(
    () =>
      fileFormats.map((format) => ({
        key: format,
        value: format,
        label: t(FILE_FORMAT_LABEL_I18N[format]),
      })),
    [fileFormats, t],
  )

  const fileFormatSet = useMemo(() => new Set(fileFormats), [fileFormats])

  return (
    <Select
      activeKey={fileFormat}
      className="flex-grow"
      label={fileFormat ? t(FILE_FORMAT_LABEL_I18N[fileFormat]) : '--'}
      onChange={setFileFormat}
      options={fileFormatOptions}
      showActiveValue={false}
      showDetails={false}
      title={t('fileFormat')}
      tooltip={
        <div className="flex flex-col gap-sds-xxs">
          {FILE_FORMAT_ORDER.filter((format) => fileFormatSet.has(format)).map(
            (format) => (
              <p key={format}>
                <I18n i18nKey={FILE_FORMAT_TOOLTIP_I18N[format]} />
              </p>
            ),
          )}
        </div>
      }
      tooltipProps={{
        classes: {
          tooltip: 'min-w-[300px]',
        },
      }}
    />
  )
}
