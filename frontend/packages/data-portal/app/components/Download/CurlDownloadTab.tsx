import { CopyBox } from 'app/components/CopyBox'
import { I18n } from 'app/components/I18n'
import { useDownloadModalContext } from 'app/context/DownloadModal.context'
import { useI18n } from 'app/hooks/useI18n'
import { useLogPlausibleCopyEvent } from 'app/hooks/useLogPlausibleCopyEvent'

import { SelectSaveDestination } from './SelectSaveDestination'

export function CurlDownloadTab() {
  const { t } = useI18n()
  const { httpsPath } = useDownloadModalContext()
  const { logPlausibleCopyEvent } = useLogPlausibleCopyEvent()

  const curlCommand = `curl -o local.mrc "${httpsPath}"`

  return (
    <div className="pt-sds-xl">
      <SelectSaveDestination />

      <CopyBox
        content={curlCommand}
        title={`2. ${t('copyAndRunCurlCommand')}`}
        titleClassName="text-sds-header-s leading-sds-header-s font-semibold mt-sds-l"
        onCopy={() => logPlausibleCopyEvent('curl-command', curlCommand)}
      />

      <div className="mt-sds-xxs">
        <I18n i18nKey="youMustHaveCurlInstalled" />
      </div>
    </div>
  )
}
