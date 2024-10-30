import axios from 'axios'
import { useCallback } from 'react'

import { useEnvironment } from 'app/context/Environment.context'
import { BreadcrumbType } from 'app/types/breadcrumbs'
import { BrowseDataTab } from 'app/types/browseData'
import { DownloadConfig, DownloadStep, DownloadTab } from 'app/types/download'

import { MetadataDrawerId } from './useMetadataDrawer'

export const PLAUSIBLE_ENV_URL_MAP: Record<NodeJS.ProcessEnv['ENV'], string> = {
  local: 'frontend.cryoet.dev.si.czi.technology',
  dev: 'frontend.cryoet.dev.si.czi.technology',
  staging: 'frontend.cryoet.staging.si.czi.technology',
  prod: 'cryoetdataportal.czscience.com',
}

export enum Events {
  ClickBackToConfigureDownload = 'Click back to configure download',
  ClickBreadcrumb = 'Click breadcrumb',
  ClickBrowseDataTab = 'Click browse data tab',
  ClickDatasetFromDeposition = 'Click dataset from deposition',
  ClickDeposition = 'Click deposition',
  ClickDownloadTab = 'Click download tab',
  ClickDownloadTomogram = 'Click download tomogram',
  ClickNextToDownloadOptions = 'Click next to configure download',
  CloseDownloadModal = 'Close download modal',
  CopyDownloadInfo = 'Copy download info',
  Filter = 'Filter',
  OpenDownloadModal = 'Open download modal',
  ToggleMetadataDrawer = 'Toggle metadata drawer',
  ViewTomogram = 'View tomogram',
}

export type PlausibleDownloadModalPayload<T = object> = T & {
  annotationId?: number
  annotationName?: string
  tomogramId?: number
  referenceTomogramId?: number
  config?: DownloadConfig
  datasetId?: number
  fileSize?: number
  objectShapeType?: string
  runId?: number
  step?: DownloadStep
  tab?: DownloadTab
  tomogramProcessing?: string
  tomogramSampling?: string
  fileFormat?: string
}

export type DownloadModalPropKeys = keyof PlausibleDownloadModalPayload

export type EventPayloads = {
  [Events.ClickBackToConfigureDownload]: PlausibleDownloadModalPayload
  [Events.ClickDownloadTab]: PlausibleDownloadModalPayload
  [Events.ClickDownloadTomogram]: PlausibleDownloadModalPayload<{
    downloadUrl: string
  }>
  [Events.ClickNextToDownloadOptions]: PlausibleDownloadModalPayload
  [Events.CloseDownloadModal]: PlausibleDownloadModalPayload
  [Events.CopyDownloadInfo]: PlausibleDownloadModalPayload<{
    type: string
    content: string
  }>
  [Events.OpenDownloadModal]: PlausibleDownloadModalPayload

  [Events.Filter]: {
    field: string
    value?: string | null
    // Add type field for future filters
    type: 'dataset' | 'run'
  }

  [Events.ToggleMetadataDrawer]: {
    open: boolean
    type: MetadataDrawerId
  }

  [Events.ViewTomogram]: {
    datasetId: number
    organism: string
    runId: number
    tomogramId: number | string
    type: 'dataset' | 'run' | 'tomogram'
  }

  [Events.ClickBrowseDataTab]: {
    tab: BrowseDataTab
  }

  [Events.ClickDeposition]: {
    id: number
  }

  [Events.ClickDatasetFromDeposition]: {
    datasetId: number
    depositionId: number
  }

  [Events.ClickBreadcrumb]: {
    type: BreadcrumbType
    datasetId?: number
    depositionId?: number
  }
}

// TODO Fix proxying for plausible
// const PLAUSIBLE_EVENT_API = '/api/event'
const PLAUSIBLE_EVENT_API = 'https://plausible.io/api/event'

export function usePlausible() {
  const { ENV, LOCALHOST_PLAUSIBLE_TRACKING } = useEnvironment()

  const logPlausibleEvent = useCallback(
    <E extends keyof EventPayloads>(
      event: E,
      ...payloads: EventPayloads[E][]
    ) => {
      const payload = {
        name: event,
        domain: PLAUSIBLE_ENV_URL_MAP[ENV],
        url: window.location.href,
        props: payloads[0],
      }

      if (ENV === 'local') {
        // eslint-disable-next-line no-console
        console.info({
          message: 'Plausible event',
          event,
          payload,
        })

        if (LOCALHOST_PLAUSIBLE_TRACKING !== 'true') {
          return
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      axios.post(PLAUSIBLE_EVENT_API, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    },
    [ENV, LOCALHOST_PLAUSIBLE_TRACKING],
  )

  return logPlausibleEvent
}

export function getPlausibleUrl({
  hasLocalhostTracking,
}: {
  hasLocalhostTracking: boolean
}) {
  const extensions = [
    'outbound-links',
    'file-downloads',
    ...(hasLocalhostTracking ? ['local'] : []),
  ].join('.')

  return `https://plausible.io/js/script.${extensions}.js`
}
