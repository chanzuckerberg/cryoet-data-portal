/**
 * This file contains test-specific types. Remove if not needed.
 */

import { DownloadTab } from 'app/types/download'

export const SINGLE_DATASET_DOWNLOAD_TABS = [DownloadTab.AWS, DownloadTab.API]

export const TOMOGRAM_DOWNLOAD_TABS = [
  DownloadTab.API,
  DownloadTab.AWS,
  DownloadTab.Curl,
  DownloadTab.Download,
]

export const ANNOTATION_STANDARD_TOMOGRAM_DOWNLOAD_TABS = [
  DownloadTab.API,
  DownloadTab.AWS,
  DownloadTab.Curl,
  DownloadTab.Download,
]

// TODO(bchu): Support new tab configuration.
export const ANNOTATION_NON_STANDARD_TOMOGRAM_DOWNLOAD_TABS = [
  DownloadTab.API,
  DownloadTab.AWS,
  DownloadTab.Curl,
  DownloadTab.Download,
]
