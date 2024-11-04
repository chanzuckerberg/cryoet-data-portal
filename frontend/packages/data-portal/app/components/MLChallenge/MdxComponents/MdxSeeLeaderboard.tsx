import { Icon } from '@czi-sds/components'

import { Link } from 'app/components/Link'

export function MdxSeeLeaderboard() {
  return (
    <p>
      <Link
        to="https://www.kaggle.com/competitions/czii-cryo-et-object-identification/leaderboard"
        className="flex items-baseline"
      >
        See Leaderboard
        <Icon
          sdsIcon="Open"
          sdsSize="xs"
          sdsType="static"
          className="ml-sds-xs"
        />
      </Link>
    </p>
  )
}
