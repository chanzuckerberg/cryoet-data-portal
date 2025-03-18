import { Icon } from '@czi-sds/components'

import { Link } from 'app/components/Link'
import { Tooltip } from 'app/components/Tooltip'
import { useI18n } from 'app/hooks/useI18n'

import { Winner, WinnerCard } from '../WinnerCard/WinnerCard'

export function TopThreeWinners({ winners }: { winners: Winner[] }) {
  const { t } = useI18n()

  return (
    <div className="top-three-winners">
      <div className="screen-716:flex justify-between items-end mb-sds-xl">
        <h2 className="text-[24px] screen-512:text-[34px] leading-[34px] screen-512:leading-[46px] tracking-[0.8px] font-semibold">
          {t('tenWinningTeams')}
        </h2>
        <div className="flex items-center gap-sds-xs">
          <p className="text-[16px] screen-512:text-sds-body-l-400-wide leading-[26px] screen-512:leading-sds-body-l">
            {t('howIsScoreCalculated')}
          </p>
          <Tooltip
            offset={[0, -3]}
            tooltip={
              <div className="text-sds-body-s-400-wide leading-sds-body-s">
                Submissions were scored using an average F
                <span className="relative top-sds-xxxs">&beta;</span> metric,
                adjusted for the detection difficulty of each species.
                <div className="text-light-sds-color-primitive-blue-400">
                  <Link to="https://www.kaggle.com/competitions/czii-cryo-et-object-identification/overview/evaluation">
                    Learn more
                  </Link>
                </div>
              </div>
            }
            placement="top-end"
            sdsStyle="light"
          >
            <span>
              <Icon
                sdsIcon="InfoCircle"
                sdsSize="s"
                className="text-light-sds-color-primitive-gray-600 mb-sds-xxxs"
                sdsType="interactive"
              />
            </span>
          </Tooltip>
        </div>
      </div>
      <div className="grid grid-cols-1 screen-1345:grid-cols-3 gap-sds-xxl">
        {winners.map(
          (winner, index) =>
            index <= 2 && (
              <WinnerCard winner={winner} key={winner.id} place={index + 1} />
            ),
        )}
      </div>
    </div>
  )
}
