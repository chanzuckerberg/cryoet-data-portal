import { Icon } from '@czi-sds/components'

import { Link } from 'app/components/Link'

export function MdxSeeLeaderboard() {
  return (
    <p className="max-w-fit">
      <Link
        to="https://www.kaggle.com/competitions/czii-cryo-et-object-identification/leaderboard"
        className="flex items-baseline"
      >
        <span>See Leaderboard</span>
        <Icon sdsIcon="Open" sdsSize="xs" className="ml-sds-xs" />
      </Link>
    </p>
  )
}
