import { Icon, Tooltip } from '@czi-sds/components'

import { Winner, WinnerCard } from '../WinnerCard/WinnerCard'

export function TopThreeWinners({ winners }: { winners: Winner[] }) {
  return (
    <div className="top-three-winners">
      <div className="screen-716:flex justify-between items-end mt-sds-xxl mb-sds-xl">
        <h2 className="text-[24px] screen-512:text-[34px] leading-[34px] screen-512:leading-[46px] kerning-[0.3px] font-semibold">
          10 Winning Teams
        </h2>
        <div className="flex items-center gap-sds-xs">
          <p className="text-[16px] screen-512:text-sds-body-l leading-[26px] screen-512:leading-sds-body-l">
            How is this score calculated
          </p>
          <Tooltip
            title="Submissions were scored using an average F  metric, adjusted for the detection difficulty of each species. Learn More"
            placement="top"
          >
            <span>
              <Icon
                sdsIcon="InfoCircle"
                sdsSize="s"
                className="text-light-sds-color-primitive-gray-600
                  dark:text-dark-sds-color-primitive-gray-600 mb-sds-xxxs"
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
