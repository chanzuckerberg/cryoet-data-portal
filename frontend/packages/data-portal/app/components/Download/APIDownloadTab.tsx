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
      match({ fileFormat, type, downloadConfig })
        .with({ type: 'dataset' }, () => ({
          label: t('datasetId'),
          content: dedent`
            from cryoet_data_portal import Client, Dataset

            client = Client()

            dataset = Dataset.get_by_id(client, ${datasetId})
            dataset.download_everything('${datasetId}')
          `,
          logType: 'dataset-id',
        }))
        .with(
          { type: 'runs', downloadConfig: DownloadConfig.AllAnnotations },
          () => ({
            label: t('voxelSpacingId'),
            content: dedent`
              from cryoet_data_portal import (
                Client,
                TomogramVoxelSpacing,
              )

              client = Client()
              tomogram_voxel_spacing = TomogramVoxelSpacing.get_by_id(
                client,
                ${tomogramVoxelId},
              )

              for annotation in tomogram_voxel_spacing.annotations:
                annotation.download()
            `,
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
            content: dedent`
              from cryoet_data_portal import Client, Tomogram

              client = Client()

              tomogram = Tomogram.get_by_id(client, ${tomogramId})
              tomogram.${downloadFunction}()
            `,
            logType: 'tomogram-code-snippet',
          }),
        )
        .with({ type: 'annotation', fileFormat: P.string }, () => ({
          label: t('copyApiCodeSnippet'),
          content: dedent`
            from cryoet_data_portal import Client, Annotation


            client = Client()

            annotation = Annotation.get_by_id(client, ${annotationId})
            annotation.download(format='${fileFormat}')
          `,
          logType: 'annotation-code-snippet',
        }))
        .otherwise(() => ({
          // no idea why this is throwing an error
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          label: t('tomogramId') as string,
          content: tomogramId,
          logType: 'tomogram-id',
        })),
    [
      annotationId,
      datasetId,
      downloadConfig,
      downloadFunction,
      fileFormat,
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
            fileFormat ? 'preferToDownloadViaApiCode' : 'preferToDownloadViaApi'
          }
          values={{
            url: `https://chanzuckerberg.github.io/cryoet-data-portal/python-api.html#${
              annotationId ? 'annotation' : 'tomogram'
            }`,
          }}
          tOptions={{
            interpolation: { escapeValue: false },
          }}
        />
      </Callout>

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
