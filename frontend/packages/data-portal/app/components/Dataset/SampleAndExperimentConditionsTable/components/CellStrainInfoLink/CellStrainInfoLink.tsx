import { Link } from 'app/components/Link'
import { OBO, WORMBASE } from 'app/constants/datasetInfoLinks'

const WORMBASE_PATTERN = /WBStrain[0-9]{8}/

export function CellStrainInfoLink({
  value,
  id,
}: {
  value?: string | null
  id?: string | null
}) {
  if (!value) {
    return <span>--</span>
  }

  if (id) {
    const isWormbase = WORMBASE_PATTERN.test(id)
    const isOBO = !isWormbase
    const link = `${isOBO ? OBO : WORMBASE}${
      isOBO ? id.replaceAll(':', '_') : id
    }`
    return (
      <Link to={link} className="text-sds-info-400">
        {value}
      </Link>
    )
  }

  return <span>{value}</span>
}
