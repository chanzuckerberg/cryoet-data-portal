import { cns } from 'app/utils/cns'

import { CompletedChallengeHeader } from './components/CompletedChallengeHeader/CompletedChallengeHeader'
import { CompletedChallengeLayout } from './components/CompletedChallengeLayout/CompletedChallengeLayout'
import { CompletedChallengeNav } from './components/CompletedChallengeNav/CompletedChallengeNav'
import { HighlightBar } from './components/HighlightBar/HighlightBar'

export function CompletedMLChallenge() {
  return (
    <div className="flex flex-col w-full overflow-x-clip">
      <CompletedChallengeHeader />

      <HighlightBar />

      <div className="flex flex-row w-full justify-between px-sds-xl relative">
        {/* Filler Component for Spacing */}
        <div className="basis-0 flex-1 max-w-[160px]" />

        <CompletedChallengeLayout />

        <div
          className={cns(
            // top = header height + xl spacing
            'sticky top-[calc(45px_+_22px)]',
            'w-[160px] h-fit',
            'mt-sds-xl ml-sds-xxl flex-shrink-0 hidden screen-760:block',
          )}
        >
          <CompletedChallengeNav />
        </div>
      </div>
    </div>
  )
}
