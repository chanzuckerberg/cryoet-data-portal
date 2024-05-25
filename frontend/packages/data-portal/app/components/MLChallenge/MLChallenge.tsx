import { MainContent } from './MainContent'
import { MLChallengeHeader } from './MLChallengeHeader'

export function MLChallenge() {
  return (
    <div className="flex flex-col w-[100vw] overflow-x-clip">
      <MLChallengeHeader />

      <div className="flex flex-row w-full justify-between px-sds-xl">
        {/* Filler Component for Spacing */}
        <div className="basis-0 flex-1 max-w-[160px]" />
        <MainContent />

        <div className="mt-sds-xl ml-sds-xxl w-[160px] h-[260px] bg-sds-gray-500 flex-shrink-0 hidden screen-760:block">
          {/* TODO: NavBar */}
        </div>
      </div>
    </div>
  )
}
