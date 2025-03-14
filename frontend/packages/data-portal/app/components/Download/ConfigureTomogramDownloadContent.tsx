import { Callout, CalloutTitle } from '@czi-sds/components'
import RadioGroup from '@mui/material/RadioGroup'
import { useCallback } from 'react'
import { match } from 'ts-pattern'

import { CopyBox } from 'app/components/CopyBox'
import { I18n } from 'app/components/I18n'
import { Radio } from 'app/components/Radio'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { useLogPlausibleCopyEvent } from 'app/hooks/useLogPlausibleCopyEvent'
import { DownloadConfig } from 'app/types/download'

import { FileFormatDropdown } from './FileFormatDropdown'
import { TomogramSelector } from './Tomogram/TomogramSelector'

const TOMOGRAM_FILE_FORMATS = ['mrc', 'zarr']

export function ConfigureTomogramDownloadContent() {
  const { t } = useI18n()

  const {
    downloadConfig,
    setAllAnnotationsConfig,
    setTomogramConfig,
    setTomogramId,
  } = useDownloadModalQueryParamState()

  const {
    tomogramToDownload,
    allAnnotationShapes = [],
    allTomograms = [],
    runId,
  } = useDownloadModalContext()

  const setTomogramConfigWithInitialValues = useCallback(() => {
    setTomogramConfig(allTomograms[0]?.id.toString())
  }, [allTomograms, setTomogramConfig])

  const { logPlausibleCopyEvent } = useLogPlausibleCopyEvent()

  return (
    <>
      <RadioGroup
        className="flex flex-col gap-sds-xxs flex-grow"
        value={downloadConfig}
        onChange={(event) =>
          match(event.target.value as DownloadConfig)
            .with(DownloadConfig.Tomogram, setTomogramConfigWithInitialValues)
            .with(DownloadConfig.AllAnnotations, setAllAnnotationsConfig)
            .exhaustive()
        }
      >
        <Radio
          value={DownloadConfig.Tomogram}
          label={t('downloadTomogram')}
          disabled={allTomograms.length === 0}
          disabledTooltip={t('noTomogramsAvailableToDownload')}
          description={t('selectASpecificTomogram')}
          onClick={setTomogramConfigWithInitialValues}
        >
          <div className="flex flex-col gap-sds-l">
            <div className="flex items-center gap-sds-l pt-sds-m">
              <TomogramSelector
                title={t('selectTomogram')}
                selectedTomogram={tomogramToDownload}
                allTomograms={allTomograms}
                onSelectTomogramId={setTomogramId}
                className="max-w-[450px]"
              />
            </div>

            <FileFormatDropdown
              fileFormats={TOMOGRAM_FILE_FORMATS}
              selectDropdownClasses={{
                root: 'w-[436px]',
                listbox: '!pr-0',
              }}
            />
          </div>
        </Radio>

        <Radio
          value={DownloadConfig.AllAnnotations}
          label={t('downloadAllAnnotations')}
          disabled={allAnnotationShapes.length === 0}
          disabledTooltip={t('noAnnotationsAvailableToDownload')}
          description={t('downloadAvailableAnnotationsInSupported')}
          onClick={setAllAnnotationsConfig}
        />
      </RadioGroup>

      {runId && (
        <Callout
          className="!w-full !mt-sds-xl !mb-sds-xxs"
          intent="info"
          expandable
          sdsStage="open"
        >
          <CalloutTitle>
            <p className="text-sds-body-xs-400-wide leading-sds-body-xs">
              <I18n i18nKey="downloadAllRunData" />
            </p>

            <p className="text-sds-body-xs-400-wide leading-sds-body-xs">
              {t('runDataIncludes')}
            </p>
          </CalloutTitle>

          <p className="text-sds-header-xs-600-wide leading-sds-header-xs mt-sds-default font-semibold">
            {t('runId')}
          </p>

          <CopyBox
            content={runId}
            onCopy={() => logPlausibleCopyEvent('run-id', String(runId))}
          />
        </Callout>
      )}

      <Callout intent="notice" className="!w-full !mt-0">
        <I18n i18nKey="annotationsMayRequireTransformation" />
      </Callout>
    </>
  )
}
