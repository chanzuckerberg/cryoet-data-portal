import { Button, Callout } from '@czi-sds/components'

import { I18n } from 'app/components/I18n'
import { QueryParams } from 'app/constants/query'
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
  const { singleDatasetHistory, setSingleDatasetHistory } =
    useSingleDatasetFilterHistory()
  const { previousSingleDepositionParams } = useDepositionHistory()
  const [, setDepositionId] = useQueryParam<string>(QueryParams.DepositionId)

  return (
    <Callout
      className="!w-full !mx-sds-xl"
      classes={{ message: 'w-full' }}
      intent="info"
    >
      <div className="flex w-full items-center justify-between">
        <p className="text-sds-body-xs leading-sds-body-xs">
          <I18n
            i18nKey={labelI18n}
            values={{
              ...deposition,
              url: `/depositions/${deposition.id}${previousSingleDepositionParams}`,
            }}
            tOptions={{ interpolation: { escapeValue: false } }}
          />
        </p>

        <Button
          onClick={() => {
            setDepositionId(null)

            const nextHistory = new Map(singleDatasetHistory)
            nextHistory.delete(QueryParams.DepositionId)
            setSingleDatasetHistory(nextHistory)
          }}
          sdsStyle="minimal"
          sdsType="secondary"
        >
          Remove Filter
        </Button>
      </div>
    </Callout>
  )
}
