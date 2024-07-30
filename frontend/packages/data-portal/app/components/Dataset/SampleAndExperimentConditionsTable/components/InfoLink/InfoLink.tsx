import { Link } from 'app/components/Link'
import {
  NCBI,
  NCBI_ONTOLOGY_PATTERN,
  OBO,
  OBO_PATTERN,
  WORMBASE,
  WORMBASE_PATTERN,
} from 'app/constants/datasetInfoLinks'

export function InfoLink({
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
    let link
    if (typeof id === 'number') {
      link = `${NCBI}${id as number}`
    } else if (id.match(NCBI_ONTOLOGY_PATTERN)) {
      link = `${NCBI}${id.replace('NCBITaxon:', '')}`
    } else if (id.match(WORMBASE_PATTERN)) {
      link = `${WORMBASE}${id.replaceAll(':', '_')}`
    } else if (id.match(OBO_PATTERN)) {
      link = `${OBO}${id.replaceAll(':', '_')}`
    }
    // don't link if no patterns match
    if (link) {
      return (
        <Link to={link} className="text-sds-info-400">
          {value}
        </Link>
      )
    }
  }

  return <span>{value}</span>
}
