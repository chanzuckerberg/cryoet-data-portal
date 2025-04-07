import { ComponentType } from 'react'

import { DownloadTab } from 'app/types/download'

import { APIDownloadTab } from './APIDownloadTab'
import { AWSDownloadTab } from './AWSDownloadTab'
import { CurlDownloadTab } from './CurlDownloadTab'
import { DirectDownloadTab } from './DirectDownloadTab'

export const DOWNLOAD_TAB_MAP: Record<DownloadTab, ComponentType> = {
  api: APIDownloadTab,
  aws: AWSDownloadTab,
  curl: CurlDownloadTab,
  download: DirectDownloadTab,
  'portal-cli': APIDownloadTab, // TODO(bchu)
}
export interface Subtitle {
  label: string
  value: string | number
}
