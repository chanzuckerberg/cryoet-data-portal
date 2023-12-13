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
  const { downloadConfig } = useDownloadModalQueryParamState()
  const { logPlausibleCopyEvent } = useLogPlausibleCopyEvent()

  const { label, resourceId, logType } = useMemo(
    () =>
      match({ type, downloadConfig })
        .with({ type: 'dataset' }, () => ({
          label: t('datasetId'),
          resourceId: datasetId,
          logType: 'dataset-id',
        }))
        .with(
          { type: 'runs', downloadConfig: DownloadConfig.AllAnnotations },
          () => ({
            label: t('voxelSpacingId'),
            resourceId: tomogramVoxelId,
            logType: 'voxel-spacing-id',
          }),
        )
        .otherwise(() => ({
          // no idea why this is throwing an error
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          label: t('tomogramId'),
          resourceId: tomogramId,
          logType: 'tomogram-id',
        })),
    [datasetId, downloadConfig, t, tomogramId, tomogramVoxelId, type],
  )

  return (
    <div className="pt-sds-xl">
      <Callout className="!w-full" intent="info">
        <I18n i18nKey="preferToDownloadViaApi" />
      </Callout>

      <CopyBox
        className="mt-sds-l"
        content={resourceId}
        title={label}
        onCopy={() => logPlausibleCopyEvent(logType, String(resourceId))}
      />
    </div>
  )
}
