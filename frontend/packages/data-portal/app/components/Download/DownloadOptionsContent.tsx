import { Callout } from '@czi-sds/components'
import { TFunction } from 'i18next'
import { isNumber, isString, startCase } from 'lodash-es'
import prettyBytes from 'pretty-bytes'
import { ComponentType } from 'react'

import { ModalSubtitle } from 'app/components/ModalSubtitle'
import { TabData, Tabs } from 'app/components/Tabs'
import { IdPrefix } from 'app/constants/idPrefixes'
import {
  DownloadModalType,
  useDownloadModalContext,
} from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { DownloadConfig, DownloadTab } from 'app/types/download'
import { checkExhaustive } from 'app/types/utils'
import { useFeatureFlag } from 'app/utils/featureFlags'
import { getTomogramName } from 'app/utils/tomograms'

import { APIDownloadTab } from './APIDownloadTab'
import { AWSDownloadTab } from './AWSDownloadTab'
import { CurlDownloadTab } from './CurlDownloadTab'
import { DirectDownloadTab } from './DirectDownloadTab'
import { DisabledTabTooltip } from './DisabledTabTooltip'
import { FILE_FORMAT_LABEL_I18N } from './FileFormatDropdown'

const DOWNLOAD_TAB_MAP: Record<DownloadTab, ComponentType> = {
  api: APIDownloadTab,
  aws: AWSDownloadTab,
  curl: CurlDownloadTab,
  download: DirectDownloadTab,
  'portal-cli': APIDownloadTab, // TODO(bchu)
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
    referenceTomogramId,
    fileFormat,
    objectShapeType,
  } = useDownloadModalQueryParamState()
  const {
    allTomograms,
    datasetId,
    datasetTitle,
    fileSize,
    objectName,
    runId,
    runName,
    tomogramToDownload,
    type,
  } = useDownloadModalContext()

  const downloadTabs = getDownloadTabs(
    type,
    fileFormat,
    t,
    multipleTomogramsEnabled,
  )
  const selectedTab =
    downloadTab ?? downloadTabs.find((tab) => !tab.disabled)!.value // Default to first enabled tab
  const referenceTomogram = allTomograms?.find(
    (tomogram) => tomogram.id.toString() === referenceTomogramId,
  )
  const DownloadTabContent = DOWNLOAD_TAB_MAP[selectedTab]

  return (
    <>
      <ModalSubtitle label={t('datasetName')} value={datasetTitle} />
      {runName && <ModalSubtitle label={t('runName')} value={runName} />}
      {multipleTomogramsEnabled && tomogramToDownload !== undefined && (
        <>
          <ModalSubtitle
            label={t('tomogramName')}
            value={getTomogramName(tomogramToDownload)}
          />
          <ModalSubtitle
            label={t('tomogramId')}
            value={`${IdPrefix.Tomogram}-${tomogramToDownload.id}`}
          />
          <ModalSubtitle
            label={t('tomogramSampling')}
            value={`${t('unitAngstrom', { value: tomogramSampling })}, (${
              tomogramToDownload.sizeX
            }, ${tomogramToDownload.sizeY}, ${tomogramToDownload.sizeZ})px`}
          />
          <ModalSubtitle
            label={t('reconstructionMethod')}
            value={startCase(tomogramToDownload.reconstructionMethod)}
          />
          <ModalSubtitle
            label={t('tomogramProcessing')}
            value={tomogramToDownload.processing}
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
      {multipleTomogramsEnabled && referenceTomogram !== undefined && (
        <ModalSubtitle
          label={t('referenceTomogram')}
          value={getTomogramName(referenceTomogram)}
        />
      )}
      {!multipleTomogramsEnabled && tomogramSampling && tomogramToDownload && (
        <ModalSubtitle
          label={t('tomogramSampling')}
          value={`${t('unitAngstrom', { value: tomogramSampling })}, (${
            tomogramToDownload.sizeX
          }, ${tomogramToDownload.sizeY}, ${tomogramToDownload.sizeZ})px`}
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
          value={selectedTab}
        />
      </div>

      <DownloadTabContent />

      {multipleTomogramsEnabled && (
        <Callout intent="notice" className="!w-full !mt-sds-xl">
          {t('annotationsMayRequireTransformation')}
        </Callout>
      )}
    </>
  )
}

function getDownloadTabs(
  type: DownloadModalType,
  fileFormat: string | null,
  t: TFunction<'translation', undefined>,
  multipleTomogramsEnabled: boolean,
): Array<TabData<DownloadTab>> {
  switch (type) {
    case 'dataset':
      return [
        { value: DownloadTab.AWS, label: t('viaAwsS3') },
        { value: DownloadTab.API, label: t('viaApi') },
      ]
    case 'runs':
      return [
        ...(isString(fileFormat) && fileFormat !== 'zarr'
          ? [
              { value: DownloadTab.Download, label: t('directDownload') },
              { value: DownloadTab.Curl, label: t('viaCurl') },
            ]
          : []),
        { value: DownloadTab.AWS, label: t('viaAwsS3') },
        { value: DownloadTab.API, label: t('viaApi') },
      ]
    case 'annotation':
      return multipleTomogramsEnabled
        ? [
            ...(isString(fileFormat) && fileFormat !== 'zarr'
              ? [
                  {
                    value: DownloadTab.Download,
                    label: t('directDownload'),
                    disabled: true, // TODO(bchu): is_portal_standard
                    tooltip: <DisabledTabTooltip />, // TODO(bchu): is_portal_standard
                  },
                  {
                    value: DownloadTab.Curl,
                    label: t('viaCurl'),
                    disabled: true, // TODO(bchu): is_portal_standard
                    tooltip: <DisabledTabTooltip />, // TODO(bchu): is_portal_standard
                  },
                ]
              : []),
            // eslint-disable-next-line no-constant-condition
            true // TODO(bchu): is_portal_standard
              ? { value: DownloadTab.PortalCLI, label: t('viaPortalCli') }
              : { value: DownloadTab.AWS, label: t('viaAwsS3') },
            { value: DownloadTab.API, label: t('viaApi') },
          ]
        : [
            ...(isString(fileFormat) && fileFormat !== 'zarr'
              ? [
                  { value: DownloadTab.Download, label: t('directDownload') },
                  { value: DownloadTab.Curl, label: t('viaCurl') },
                ]
              : []),
            { value: DownloadTab.AWS, label: t('viaAwsS3') },
            { value: DownloadTab.API, label: t('viaApi') },
          ]
    default:
      return checkExhaustive(type)
  }
}
