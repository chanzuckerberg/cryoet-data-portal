import { Button, Callout } from '@czi-sds/components'

import { I18n } from 'app/components/I18n'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'
import { useQueryParam } from 'app/hooks/useQueryParam'
import {
  useDepositionHistory,
  useSingleDatasetFilterHistory,
} from 'app/state/filterHistory'
import { I18nKeys } from 'app/types/i18n'

interface Deposition {
  id: number
  title: string
}

export function DepositionFilterBanner({
  deposition,
  labelI18n,
}: {
  deposition: Deposition
  labelI18n: I18nKeys
}) {
  const { previousSingleDatasetParams, setPreviousSingleDatasetParams } =
    useSingleDatasetFilterHistory()
  const { previousSingleDepositionParams } = useDepositionHistory()
  const [, setDepositionId] = useQueryParam<string>(QueryParams.DepositionId)

  const { t } = useI18n()

  return (
    <Callout className="!w-full" classes={{ message: 'w-full' }} intent="info">
      <div className="flex w-full items-center gap-sds-l justify-between">
        {/* TODO: (kne42) sync with design on what we want to do on overflow */}
        <p className="text-sds-body-xs-400-wide leading-sds-body-xs flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
          <I18n
            i18nKey={labelI18n}
            values={{
              ...deposition,
              url: `/depositions/${deposition.id}?${previousSingleDepositionParams}`,
            }}
            tOptions={{ interpolation: { escapeValue: false } }}
          />
        </p>

        <Button
          onClick={() => {
            setDepositionId(null)

            const nextParams = new URLSearchParams(previousSingleDatasetParams)
            nextParams.delete(QueryParams.DepositionId)
            nextParams.sort()
            setPreviousSingleDatasetParams(nextParams.toString())
          }}
          sdsStyle="minimal"
          sdsType="secondary"
          className="shrink-0"
        >
          {t('removeFilter')}
        </Button>
      </div>
    </Callout>
  )
}
