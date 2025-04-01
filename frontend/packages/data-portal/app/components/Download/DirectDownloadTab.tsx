import { Button } from '@czi-sds/components'

import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { Events, usePlausible } from 'app/hooks/usePlausible'

export function DirectDownloadTab() {
  const { t } = useI18n()
  const { httpsPath, datasetId, runId, fileSize } = useDownloadModalContext()
  const plausible = usePlausible()
  const { getPlausiblePayload } = useDownloadModalQueryParamState()

  return (
    <div className="pt-sds-xl">
      <p className="flex items-center gap-sds-xxs">
        <span className="text-sds-header-s-600-wide leading-sds-header-s font-semibold">
          {t('clickToDownloadViaBrowser')}
        </span>
      </p>

      {httpsPath && (
        <Button
          className="!mt-sds-xs !mb-sds-l"
          sdsType="secondary"
          sdsStyle="square"
          href={httpsPath}
          onClick={() =>
            plausible(Events.ClickDownloadTomogram, {
              downloadUrl: httpsPath,
              ...getPlausiblePayload({
                datasetId,
                fileSize,
                runId,
              }),
            })
          }
        >
          {t('downloadNow')}
        </Button>
      )}

      <p className="text-sds-body-xs-400-wide leading-sds-body-xs text-light-sds-color-primitive-gray-500">
        {t('ifYouEncounterIssuesWithDownloadTime')}
      </p>
    </div>
  )
}
