import { Callout } from '@czi-sds/components'
import dedent from 'dedent'
import { useMemo } from 'react'
import { match, P } from 'ts-pattern'

import { CopyBox } from 'app/components/CopyBox'
import { I18n } from 'app/components/I18n'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { useLogPlausibleCopyEvent } from 'app/hooks/useLogPlausibleCopyEvent'
import { DownloadConfig } from 'app/types/download'
import { I18nKeys } from 'app/types/i18n'

export function getDatasetCodeSnippet(datasetId?: number) {
  return dedent`
    from cryoet_data_portal import Client, Dataset

    client = Client()

    dataset = Dataset.get_by_id(client, ${datasetId})
    dataset.download_everything()
  `
}

export function getAllTomogramsCodeSnippet(runId?: number) {
  return dedent`
    from cryoet_data_portal import (
      Client,
      Run,
    )

    client = Client()
    run = Run.get_by_id(client, ${runId})

    for annotation in run.annotations:
      annotation.download()
  `
}

export function getTomogramCodeSnippet(
  tomogramId?: number,
  fileFormat?: string | null,
) {
  const downloadFunction = match(fileFormat)
    .with('mrc', () => 'download_mrcfile')
    .with('zarr', () => 'download_omezarr')
    .with('ndjson', () => 'download_ndjson')
    .otherwise(() => '')

  return dedent`
    from cryoet_data_portal import Client, Tomogram

    client = Client()

    tomogram = Tomogram.get_by_id(client, ${tomogramId})
    tomogram.${downloadFunction}()
  `
}

export function getAnnotationCodeSnippet(
  annotationId: string | null,
  fileFormat: string | null,
) {
  return dedent`
    from cryoet_data_portal import Client, Annotation


    client = Client()

    annotation = Annotation.get_by_id(client, ${annotationId})
    annotation.download(format='${fileFormat}')
  `
}

export function APIDownloadTab() {
  const { t } = useI18n()
  const { runId, datasetId, tomogramId, type } = useDownloadModalContext()
  const { annotationId, downloadConfig, fileFormat } =
    useDownloadModalQueryParamState()
  const { logPlausibleCopyEvent } = useLogPlausibleCopyEvent()

  const { label, content, calloutKey, logType } = useMemo(
    () =>
      match({ fileFormat, type, downloadConfig })
        .with({ type: 'dataset' }, () => ({
          label: t('copyApiCodeSnippet'),
          content: getDatasetCodeSnippet(datasetId),
          calloutKey: 'preferToDownloadViaApiCode',
          logType: 'dataset-id',
        }))
        .with(
          { type: 'runs', downloadConfig: DownloadConfig.AllAnnotations },
          () => ({
            label: t('copyApiCodeSnippet'),
            content: getAllTomogramsCodeSnippet(runId),
            calloutKey: 'preferToDownloadViaApiCode',
            logType: 'voxel-spacing-id',
          }),
        )
        .with(
          {
            type: 'runs',
            downloadConfig: DownloadConfig.Tomogram,
            fileFormat: P.string,
          },
          () => ({
            label: t('copyApiCodeSnippet'),
            content: getTomogramCodeSnippet(tomogramId, fileFormat),
            calloutKey: 'preferToDownloadViaApiCode',
            logType: 'tomogram-code-snippet',
          }),
        )
        .with({ type: 'annotation', fileFormat: P.string }, () => ({
          label: t('copyApiCodeSnippet'),
          content: getAnnotationCodeSnippet(annotationId, fileFormat),
          calloutKey: 'preferToDownloadViaApiCode',
          logType: 'annotation-code-snippet',
        }))
        .otherwise(() => ({
          // no idea why this is throwing an error
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          label: t('tomogramId') as string,
          content: tomogramId,
          calloutKey: 'preferToDownloadViaApi',
          logType: 'tomogram-id',
        })),
    [
      annotationId,
      datasetId,
      downloadConfig,
      fileFormat,
      runId,
      t,
      tomogramId,
      type,
    ],
  )

  return (
    <div className="pt-sds-xl">
      <Callout
        className="!w-full !mt-0"
        intent="info"
        body={<I18n i18nKey={calloutKey as I18nKeys} />}
      />

      <CopyBox
        className="mt-sds-l"
        codeClassName="whitespace-pre"
        content={content}
        title={label}
        onCopy={() => logPlausibleCopyEvent(logType, String(content))}
      />
    </div>
  )
}
