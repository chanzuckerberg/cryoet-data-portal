import { cns } from 'app/utils/cns'

import { CompletedChallengeHeader } from './components/CompletedChallengeHeader/CompletedChallengeHeader'
import { CompletedChallengeLayout } from './components/CompletedChallengeLayout/CompletedChallengeLayout'
import { CompletedChallengeNav } from './components/CompletedChallengeNav/CompletedChallengeNav'

export function CompletedMLChallenge() {
  return (
    <div className="flex flex-col w-full overflow-x-clip">
      <CompletedChallengeHeader />

      <div className="bg-[#002D90] text-sds-color-primitive-common-white text-[18px] screen-879:text-sds-header-xl font-semibold py-sds-l px-sds-xl">
        <div className="max-w-content-small mx-auto flex flex-col screen-620:flex-row justify-between gap-sds-xxl">
          <p>$75k prize</p>
          <p>172 Teams / 3268 Entrants</p>
          <p>1,085 Submissions</p>
        </div>
      </div>

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
