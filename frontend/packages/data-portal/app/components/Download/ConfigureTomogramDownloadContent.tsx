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
import { TomogramSelectorInputLabel } from './TomogramSelectorLabel'
import { TomogramSelectorOption } from './TomogramSelectorOption'

const TOMOGRAM_FILE_FORMATS = ['mrc', 'zarr']

export function ConfigureTomogramDownloadContent() {
  const multipleTomogramsEnabled = useFeatureFlag('multipleTomograms')

  const { t } = useI18n()

  const {
    downloadConfig,
    tomogramProcessing,
    tomogramSampling,
    tomogramId,
    setAllAnnotationsConfig,
    setTomogramConfig,
    setTomogramProcessing,
    setTomogramSampling,
    setTomogramId,
  } = useDownloadModalQueryParamState()

  const {
    allTomogramProcessing = [],
    allTomograms = [],
    runId,
  } = useDownloadModalContext()

  const tomogramSamplingOptions = useMemo<SelectOption[]>(
    () =>
      allTomograms.map((tomogram) => ({
        key: t('unitAngstrom', { value: tomogram.voxel_spacing }),
        value: `(${tomogram.size_x}, ${tomogram.size_y}, ${tomogram.size_z})px`,
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

  const tomogramOptions = useMemo<SelectOption[]>(
    () =>
      allTomograms.map((tomogram) => ({
        key: tomogram.id.toString(),
        value: tomogram.id.toString(),
        component: <TomogramSelectorOption tomogram={tomogram} />,
      })),
    [allTomograms],
  )

  const activeTomogram = allTomograms.find((tomogram) =>
    multipleTomogramsEnabled
      ? tomogram.id === Number(tomogramId)
      : `${tomogram.voxel_spacing}` === tomogramSampling,
  )

  const setTomogramConfigWithInitialValues = useCallback(() => {
    const tomogram = allTomograms.at(0)
    const processing = allTomogramProcessing.at(0)

    if (tomogram && processing) {
      setTomogramConfig(`${tomogram.voxel_spacing}`, processing)
    }
  }, [allTomogramProcessing, allTomograms, setTomogramConfig])

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
                <Select
                  title={t('selectTomogram')}
                  className="flex-grow"
                  dropdownClasses={{
                    root: 'w-[448px]',
                    popper: 'h-[325px] !p-sds-xs overflow-y-auto',
                    listbox: '!pr-0',
                  }}
                  dropdownPopperBaseProps={{
                    className: '!p-0',
                  }}
                  activeKey={tomogramId}
                  label={
                    <TomogramSelectorInputLabel tomogram={activeTomogram} />
                  }
                  options={tomogramOptions}
                  onChange={setTomogramId}
                  showActiveValue={false}
                  showDetails={false}
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
                      activeTomogram
                        ? `${t('unitAngstrom', {
                            value: activeTomogram.voxel_spacing,
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
              className={!multipleTomogramsEnabled ? 'max-w-[228px]' : 'asdf'}
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
          description={t('downloadAllAnnotationsInThisRun')}
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
    </>
  )
}
