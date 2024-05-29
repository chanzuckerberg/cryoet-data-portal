import { cns } from 'app/utils/cns'

import { MainContent } from './MainContent'
import { MLChallengeHeader } from './MLChallengeHeader'
import { MLChallengeNavigation } from './MLChallengeNavigation'

export function MLChallenge() {
  return (
    <div className="flex flex-col w-[100vw] overflow-x-clip">
      <MLChallengeHeader />

      <div className="flex flex-row w-full justify-between px-sds-xl relative">
        {/* Filler Component for Spacing */}
        <div className="basis-0 flex-1 max-w-[160px]" />

        <MainContent />

        <div
          className={cns(
            // top = header height + xl spacing
            'sticky top-[calc(45px_+_22px)]',
            'w-[160px] h-fit',
            'mt-sds-xl ml-sds-xxl flex-shrink-0 hidden screen-760:block',
          )}
        >
          <MLChallengeNavigation />
        </div>
      </div>
    </div>
  )
}
