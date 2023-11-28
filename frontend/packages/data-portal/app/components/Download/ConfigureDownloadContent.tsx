import { Callout, CalloutTitle, InputRadio } from '@czi-sds/components'
import RadioGroup from '@mui/material/RadioGroup'
import {
  createElement,
  MouseEvent,
  ReactNode,
  useCallback,
  useMemo,
} from 'react'
import { match } from 'ts-pattern'

import { I18n } from 'app/components/I18n'
import { ModalSubtitle } from 'app/components/ModalSubtitle'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { DownloadConfig } from 'app/types/download'
import { cns } from 'app/utils/cns'

import { CopyBox } from '../CopyBox'
import { Select, SelectOption } from '../Select'

function Radio({
  children,
  description,
  label,
  onClick,
  value,
}: {
  children?: ReactNode
  description: string
  label: string
  onClick?(): void
  value: DownloadConfig
}) {
  const { downloadConfig } = useDownloadModalQueryParamState()
  const isActive = downloadConfig === value

  return createElement(
    isActive ? 'div' : 'button',
    {
      className: cns(
        'flex gap-sds-default p-sds-l transition-colors text-left',

        isActive && 'bg-sds-gray-100',
      ),

      ...(isActive
        ? {}
        : {
            onClick(event: MouseEvent<HTMLButtonElement>) {
              event.stopPropagation()
              onClick?.()
            },
            type: 'button',
          }),
    },
    <>
      <InputRadio value={value} />

      <div className="flex flex-col gap-sds-xxxs !tracking-[0.3px]">
        <span className="text-sds-header-s leading-sds-header-s font-semibold">
          {label}
        </span>
        <span className="text-sds-gray-600 text-sds-body-xs leading-sds-body-xs">
          {description}
        </span>

        {isActive && children}
      </div>
    </>,
  )
}

export function ConfigureDownloadContent() {
  const { t } = useI18n()

  const {
    downloadConfig,
    setAllAnnotationsConfig,
    setTomogramConfig,
    setTomogramProcessing,
    setTomogramSampling,
    tomogramProcessing,
    tomogramSampling,
  } = useDownloadModalQueryParamState()

  const {
    allTomogramProcessing = [],
    allTomogramResolutions = [],
    datasetId,
    runName,
  } = useDownloadModalContext()

  const tomogramSamplingOptions = useMemo<SelectOption[]>(
    () =>
      allTomogramResolutions.map((tomogram) => ({
        key: t('unitAngstrom', { value: tomogram.voxel_spacing }),
        value: `(${tomogram.size_x}, ${tomogram.size_y}, ${tomogram.size_z})px`,
      })),
    [allTomogramResolutions, t],
  )

  const tomogramProcessingOptions = useMemo<SelectOption[]>(
    () =>
      allTomogramProcessing.map((processing) => ({
        key: processing,
        value: processing,
      })),
    [allTomogramProcessing],
  )

  const activeTomogram = allTomogramResolutions.find(
    (tomogram) => `${tomogram.voxel_spacing}` === tomogramSampling,
  )

  const setTomogramConfigWithInitialValues = useCallback(() => {
    const tomogram = allTomogramResolutions.at(0)
    const processing = allTomogramProcessing.at(0)

    if (tomogram && processing) {
      setTomogramConfig(`${tomogram.voxel_spacing}`, processing)
    }
  }, [allTomogramProcessing, allTomogramResolutions, setTomogramConfig])

  return (
    <>
      <ModalSubtitle label={t('dataset')} value={datasetId} />
      {runName && <ModalSubtitle label={t('run')} value={runName} />}

      <p className="mt-sds-xl text-sds-body-m leading-sds-body-m font-semibold">
        {t('selectDownload')}
      </p>

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
          <div className="flex items-center gap-sds-l pt-sds-m">
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
          </div>
        </Radio>

        <Radio
          value={DownloadConfig.AllAnnotations}
          label={t('downloadAllAnnotations')}
          description={t('downloadAllAnnotationsInThisRun')}
          onClick={setAllAnnotationsConfig}
        />
      </RadioGroup>

      <Callout className="!w-full" intent="info" expandable>
        <CalloutTitle>
          <p className="text-sds-body-xs leading-sds-body-xs">
            <I18n i18nKey="downloadAllRunData" />
          </p>

          <p className="text-sds-body-xs leading-sds-body-xs">
            {t('runDataIncludes')}
          </p>
        </CalloutTitle>

        <p className="text-sds-header-xs leading-sds-header-xs mt-sds-default font-semibold">
          [TBD ID]
        </p>
        <CopyBox content="00000000" />

        <p className="text-sds-header-xs leading-sds-header-xs mt-sds-l font-semibold">
          [TBD ID]
        </p>
        <CopyBox content="00000000" />
      </Callout>
    </>
  )
}
