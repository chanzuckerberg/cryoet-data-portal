import { Icon, Link } from '@czi-sds/components'

import { Tooltip } from 'app/components/Tooltip'

import { Winner, WinnerCard } from '../WinnerCard/WinnerCard'

export function TopThreeWinners({ winners }: { winners: Winner[] }) {
  return (
    <div className="top-three-winners">
      <div className="screen-716:flex justify-between items-end mt-sds-xxl mb-sds-xl">
        <h2 className="text-[24px] screen-512:text-[34px] leading-[34px] screen-512:leading-[46px] tracking-[0.8px] font-semibold">
          10 Winning Teams
        </h2>
        <div className="flex items-center gap-sds-xs">
          <p className="text-[16px] screen-512:text-sds-body-l leading-[26px] screen-512:leading-sds-body-l">
            How is this score calculated
          </p>
          <Tooltip
            tooltip={
              <div className="text-sds-body-s leading-sds-body-s">
                {}
                Submissions were scored using an average F
                <span className="relative top-sds-xxxs">&beta;</span> metric,
                adjusted for the detection difficulty of each species.
                <div className="text-sds-color-primitive-blue-400">
                  <Link to="/TODO">Learn more</Link>
                </div>
              </div>
            }
            placement="top-start"
            sdsStyle="light"
          >
            <span>
              <Icon
                sdsIcon="InfoCircle"
                sdsSize="s"
                className="text-sds-color-primitive-gray-600 mb-sds-xxxs"
                sdsType="interactive"
              />
            </span>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col screen-1345:flex-row gap-sds-xxl">
        {winners.map(
          (winner, index) =>
            index <= 2 && (
              <WinnerCard winner={winner} key={winner.name} place={index + 1} />
            ),
        )}
      </div>
    </div>
  )
}
