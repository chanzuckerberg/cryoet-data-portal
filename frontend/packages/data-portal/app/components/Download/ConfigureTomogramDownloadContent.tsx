import { Callout, CalloutTitle } from '@czi-sds/components'
import RadioGroup from '@mui/material/RadioGroup'
import { useCallback, useMemo } from 'react'
import { match } from 'ts-pattern'

import { CopyBox } from 'app/components/CopyBox'
import { I18n } from 'app/components/I18n'
import { Radio } from 'app/components/Radio'
import { Select, SelectOption } from 'app/components/Select'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { useLogPlausibleCopyEvent } from 'app/hooks/useLogPlausibleCopyEvent'
import { DownloadConfig } from 'app/types/download'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { FileFormatDropdown } from './FileFormatDropdown'
import { TomogramSelector } from './Tomogram/TomogramSelector'

const TOMOGRAM_FILE_FORMATS = ['mrc', 'zarr']

export function ConfigureTomogramDownloadContent() {
  const multipleTomogramsEnabled = useFeatureFlag('multipleTomograms')

  const { t } = useI18n()

  const {
    downloadConfig,
    tomogramProcessing,
    tomogramSampling,
    setAllAnnotationsConfig,
    setTomogramConfigDeprecated,
    setTomogramConfig,
    setTomogramProcessing,
    setTomogramSampling,
    setTomogramId,
  } = useDownloadModalQueryParamState()

  const {
    tomogramToDownload,
    allTomogramProcessing = [],
    allTomograms = [],
    runId,
  } = useDownloadModalContext()

  const tomogramSamplingOptions = useMemo<SelectOption[]>(
    () =>
      allTomograms.map((tomogram) => ({
        key: t('unitAngstrom', { value: tomogram.voxelSpacing }),
        value: `(${tomogram.sizeX}, ${tomogram.sizeY}, ${tomogram.sizeZ})px`,
      })),
    [allTomograms, t],
  )

  const tomogramProcessingOptions = useMemo<SelectOption[]>(
    () =>
      allTomogramProcessing.map((processing) => ({
        key: processing,
        value: processing,
      })),
    [allTomogramProcessing],
  )

  const setTomogramConfigWithInitialValues = useCallback(() => {
    if (multipleTomogramsEnabled) {
      setTomogramConfig(allTomograms[0]?.id.toString())
      return
    }

    const tomogram = allTomograms.at(0)
    const processing = allTomogramProcessing.at(0)

    if (tomogram && processing) {
      setTomogramConfigDeprecated(`${tomogram.voxelSpacing}`, processing)
    }
  }, [
    allTomogramProcessing,
    allTomograms,
    setTomogramConfigDeprecated,
    setTomogramConfig,
    multipleTomogramsEnabled,
  ])

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
          description={t('selectASpecificTomogram')}
          onClick={setTomogramConfigWithInitialValues}
        >
          <div className="flex flex-col gap-sds-l">
            <div className="flex items-center gap-sds-l pt-sds-m">
              {multipleTomogramsEnabled ? (
                <TomogramSelector
                  title={t('selectTomogram')}
                  selectedTomogram={tomogramToDownload}
                  allTomograms={allTomograms}
                  onSelectTomogramId={setTomogramId}
                  className="max-w-[450px]"
                />
              ) : (
                <>
                  <Select
                    activeKey={
                      tomogramSampling
                        ? t('unitAngstrom', { value: tomogramSampling })
                        : null
                    }
                    className="flex-grow"
                    label={
                      tomogramToDownload
                        ? `${t('unitAngstrom', {
                            value: tomogramToDownload.voxelSpacing,
                          })}`
                        : '--'
                    }
                    onChange={(value) =>
                      setTomogramSampling(value ? value.replace('Å', '') : null)
                    }
                    options={tomogramSamplingOptions}
                    title={t('tomogramSampling')}
                  />

                  <Select
                    activeKey={tomogramProcessing}
                    className="flex-grow"
                    label={tomogramProcessing ?? '--'}
                    onChange={setTomogramProcessing}
                    options={tomogramProcessingOptions}
                    showActiveValue={false}
                    showDetails={false}
                    title={t('tomogramProcessing')}
                  />
                </>
              )}
            </div>

            <FileFormatDropdown
              className={
                !multipleTomogramsEnabled ? 'max-w-[228px]' : undefined
              }
              fileFormats={TOMOGRAM_FILE_FORMATS}
              selectDropdownClasses={
                multipleTomogramsEnabled
                  ? {
                      root: 'w-[436px]',
                      listbox: '!pr-0',
                    }
                  : undefined
              }
            />
          </div>
        </Radio>

        <Radio
          value={DownloadConfig.AllAnnotations}
          label={t('downloadAllAnnotations')}
          description={t('downloadAvailableAnnotationsInSupported')}
          onClick={setAllAnnotationsConfig}
        />
      </RadioGroup>

      {runId && (
        <Callout className="!w-full !mt-sds-xl" intent="info" expandable>
          <CalloutTitle>
            <p className="text-sds-body-xs leading-sds-body-xs">
              <I18n i18nKey="downloadAllRunData" />
            </p>

            <p className="text-sds-body-xs leading-sds-body-xs">
              {t('runDataIncludes')}
            </p>
          </CalloutTitle>

          <p className="text-sds-header-xs leading-sds-header-xs mt-sds-default font-semibold">
            {t('runId')}
          </p>

          <CopyBox
            content={runId}
            onCopy={() => logPlausibleCopyEvent('run-id', String(runId))}
          />
        </Callout>
      )}

      {multipleTomogramsEnabled && (
        <Callout intent="notice" className="!w-full !mt-0">
          {t('annotationsDownloadedFromThePortal')}
        </Callout>
      )}
    </>
  )
}
