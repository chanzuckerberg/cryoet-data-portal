import { Callout } from '@czi-sds/components'
import { useMemo } from 'react'
import { match } from 'ts-pattern'

import { CopyBox } from 'app/components/CopyBox'
import { I18n } from 'app/components/I18n'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { useLogPlausibleCopyEvent } from 'app/hooks/useLogPlausibleCopyEvent'
import { DownloadConfig } from 'app/types/download'

export function APIDownloadTab() {
  const { t } = useI18n()
  const { datasetId, tomogramId, tomogramVoxelId, type } =
    useDownloadModalContext()
  const { annotationId, downloadConfig, fileFormat } =
    useDownloadModalQueryParamState()
  const { logPlausibleCopyEvent } = useLogPlausibleCopyEvent()

  const downloadFunction = match(fileFormat)
    .with('mrc', () => 'download_mrcfile')
    .with('zarr', () => 'download_omezarr')
    .with('ndjson', () => 'download_ndjson')
    .otherwise(() => '')

  const { label, content, logType } = useMemo(
    () =>
      match({ annotationId, type, downloadConfig })
        .with({ type: 'dataset' }, () => ({
          label: t('datasetId'),
          content: datasetId,
          logType: 'dataset-id',
        }))
        .with(
          { type: 'runs', downloadConfig: DownloadConfig.AllAnnotations },
          () => ({
            label: t('voxelSpacingId'),
            content: tomogramVoxelId,
            logType: 'voxel-spacing-id',
          }),
        )
        .with({ type: 'annotation' }, () => ({
          label: t('copyApiCodeSnippet'),
          content: (
            <>
              from cryoet_data_portal import Client, Annotation
              <br />
              client = Client()
              <br />
              annotation = Annotation.get_by_id(client, {annotationId})
              <br />
              annotation.download(format=&quot;{fileFormat}&quot;)
            </>
          ),
          logType: 'annotation-code-snippet',
        }))
        .otherwise(() => ({
          // no idea why this is throwing an error
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          label: t('tomogramId'),
          content: tomogramId,
          logType: 'tomogram-id',
        })),
    [
      annotationId,
      datasetId,
      downloadConfig,
      downloadFunction,
      t,
      tomogramId,
      tomogramVoxelId,
      type,
    ],
  )

  return (
    <div className="pt-sds-xl">
      <Callout className="!w-full !mt-0" intent="info">
        <I18n
          i18nKey={
            annotationId
              ? 'preferToDownloadViaApiCode'
              : 'preferToDownloadViaApi'
          }
        />
      </Callout>

      <CopyBox
        className="mt-sds-l"
        content={content}
        title={label}
        onCopy={() => logPlausibleCopyEvent(logType, String(content))}
      />
    </div>
  )
}
