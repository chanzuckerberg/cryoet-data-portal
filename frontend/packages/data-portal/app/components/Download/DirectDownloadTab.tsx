import { Link } from 'app/components/Link'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { Events, usePlausible } from 'app/hooks/usePlausible'
import { cns } from 'app/utils/cns'

export function DirectDownloadTab() {
  const { t } = useI18n()
  const { httpsPath, datasetId, runId, fileSize } = useDownloadModalContext()
  const plausible = usePlausible()
  const { getPlausiblePayload, fileFormat } = useDownloadModalQueryParamState()

  return (
    <div className="pt-sds-xl">
      <p className="flex items-center gap-sds-xxs">
        <span className="text-sds-header-s leading-sds-header-s font-semibold">
          {t('clickToDownloadViaBrowser')}
        </span>

        <span className="text-sds-body-xs leading-sds-body-xs text-sds-gray-500">
          ({fileFormat} {t('format')})
        </span>
      </p>

      {httpsPath && (
        <Link
          className={cns(
            'inline-block mt-sds-xxxs mb-sds-l',
            'border border-sds-primary-400 rounded-sds-m',
            'py-[7px] px-sds-l',
            'bg-white text-sds-primary-400',
          )}
          to={httpsPath}
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
        </Link>
      )}

      <p className="text-sds-body-xs leading-sds-body-xs text-sds-gray-500">
        {t('ifYouEncounterIssuesWithDownloadTime')}
      </p>
    </div>
  )
}
