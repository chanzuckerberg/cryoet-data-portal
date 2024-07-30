import { Link } from 'app/components/Link'
import { NIH, OBO } from 'app/constants/datasetInfoLinks'

export function InfoLink({
  value,
  id,
  isOBO,
}: {
  value?: string | null
  id?: string | null
  isOBO?: boolean
}) {
  if (!value) {
    return <span>--</span>
  }

  if (id) {
    const link = `${isOBO ? OBO : NIH}${isOBO ? id.replaceAll(':', '_') : id}`
    return (
      <Link to={link} className="text-sds-info-400">
        {value}
      </Link>
    )
  }

  return <span>{value}</span>
}
