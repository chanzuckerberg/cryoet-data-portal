import { Callout } from '@czi-sds/components'
import { isNumber, isString, startCase } from 'lodash-es'
import prettyBytes from 'pretty-bytes'
import { ComponentType, useMemo } from 'react'

import { ModalSubtitle } from 'app/components/ModalSubtitle'
import { TabData, Tabs } from 'app/components/Tabs'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { DownloadConfig, DownloadTab } from 'app/types/download'
import { useFeatureFlag } from 'app/utils/featureFlags'
import { getTomogramName } from 'app/utils/tomograms'

import { APIDownloadTab } from './APIDownloadTab'
import { AWSDownloadTab } from './AWSDownloadTab'
import { CurlDownloadTab } from './CurlDownloadTab'
import { DirectDownloadTab } from './DirectDownloadTab'
import { FILE_FORMAT_LABEL_I18N } from './FileFormatDropdown'

const DOWNLOAD_TAB_MAP: Record<DownloadTab, ComponentType> = {
  api: APIDownloadTab,
  aws: AWSDownloadTab,
  curl: CurlDownloadTab,
  download: DirectDownloadTab,
}

export function DownloadOptionsContent() {
  const multipleTomogramsEnabled = useFeatureFlag('multipleTomograms')
  const { t } = useI18n()
  const {
    downloadTab,
    setDownloadTab,
    downloadConfig,
    tomogramProcessing,
    tomogramSampling,
    annotationId,
    fileFormat,
    objectShapeType,
  } = useDownloadModalQueryParamState()
  const { activeTomogram } = useDownloadModalContext()

  const downloadTabs = useMemo<TabData<DownloadTab>[]>(
    () => [
      ...(isString(fileFormat) && fileFormat !== 'zarr'
        ? [
            { value: DownloadTab.Download, label: t('directDownload') },
            { value: DownloadTab.Curl, label: t('viaCurl') },
          ]
        : []),

      { value: DownloadTab.AWS, label: t('viaAwsS3') },
      { value: DownloadTab.API, label: t('viaApi') },
    ],
    [fileFormat, t],
  )

  const { datasetId, datasetTitle, fileSize, objectName, runId, runName } =
    useDownloadModalContext()

  if (!downloadTab) {
    return null
  }

  const DownloadTabContent = DOWNLOAD_TAB_MAP[downloadTab]

  return (
    <>
      <ModalSubtitle label={t('datasetName')} value={datasetTitle} />
      {runName && <ModalSubtitle label={t('runName')} value={runName} />}
      {multipleTomogramsEnabled && activeTomogram !== undefined && (
        <>
          <ModalSubtitle
            label={t('tomogramName')}
            value={getTomogramName(
              activeTomogram.id,
              activeTomogram.reconstruction_method,
              activeTomogram.processing,
            )}
          />
          <ModalSubtitle label={t('tomogramId')} value={activeTomogram.id} />
          <ModalSubtitle
            label={t('tomogramSampling')}
            value={`${t('unitAngstrom', { value: tomogramSampling })}, (${
              activeTomogram.size_x
            }, ${activeTomogram.size_y}, ${activeTomogram.size_z})px`}
          />
          <ModalSubtitle
            label={t('reconstructionMethod')}
            value={startCase(activeTomogram.reconstruction_method)}
          />
          <ModalSubtitle
            label={t('tomogramProcessing')}
            value={activeTomogram.processing}
          />
        </>
      )}
      {annotationId && (
        <ModalSubtitle label={t('annotationId')} value={annotationId} />
      )}
      {objectName && (
        <ModalSubtitle label={t('objectName')} value={objectName} />
      )}
      {objectShapeType && (
        <ModalSubtitle label={t('objectShapeType')} value={objectShapeType} />
      )}
      {!multipleTomogramsEnabled && tomogramSampling && activeTomogram && (
        <ModalSubtitle
          label={t('tomogramSampling')}
          value={`${t('unitAngstrom', { value: tomogramSampling })}, (${
            activeTomogram.size_x
          }, ${activeTomogram.size_y}, ${activeTomogram.size_z})px`}
        />
      )}
      {!multipleTomogramsEnabled && tomogramProcessing && (
        <ModalSubtitle
          label={t('tomogramProcessing')}
          value={tomogramProcessing}
        />
      )}
      {fileFormat && (
        <ModalSubtitle
          label={t('fileFormat')}
          value={t(FILE_FORMAT_LABEL_I18N[fileFormat])}
        />
      )}
      {isNumber(fileSize) && (
        <ModalSubtitle
          label={t('estimatedDownloadSize')}
          value={prettyBytes(fileSize)}
        />
      )}
      {downloadConfig === DownloadConfig.AllAnnotations && (
        <ModalSubtitle label={t('annotations')} value={t('all')} />
      )}

      <p className="font-semibold text-sds-body-m leading-sds-body-m mt-sds-xl">
        {t('selectDownloadMethod')}:
      </p>

      {downloadTab && (
        <div className="border-b-2 border-sds-color-primitive-gray-200">
          <Tabs
            onChange={(tab) =>
              setDownloadTab({
                tab,
                datasetId,
                runId,
              })
            }
            tabs={downloadTabs}
            value={downloadTab}
          />
        </div>
      )}

      <DownloadTabContent />

      {multipleTomogramsEnabled && (
        <Callout intent="notice" className="!w-full">
          {t('annotationsDownloadedFromThePortal')}
        </Callout>
      )}
    </>
  )
}
