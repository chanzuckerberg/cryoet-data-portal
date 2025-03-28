import { TFunction } from 'i18next'
import { isString } from 'lodash-es'

import { TabData } from 'app/components/Tabs'
import { DownloadModalType } from 'app/context/DownloadModal.context'
import { DownloadTab } from 'app/types/download'
import { checkExhaustive } from 'app/types/utils'

import { Subtitle } from './types'

export function buildSubtitles(...entries: Array<unknown>): Subtitle[] {
  return entries.filter(Boolean) as Subtitle[]
}

export function getDownloadTabs(
  type: DownloadModalType,
  fileFormat: string | null,
  t: TFunction<'translation', undefined>,
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
    default:
      return checkExhaustive(type)
  }
}
