import { Link } from 'app/components/Link'
import {
  CDPO,
  CDPO_PREFIX,
  CHEBI,
  CHEBI_PREFIX,
  CL,
  CL_PREFIX,
  GO,
  GO_PREFIX,
  PDB,
  PDB_PREFIX,
  UBERON,
  UBERON_PREFIX,
  UNIPROTKB,
  UNIPROTKB_PREFIX,
} from 'app/constants/annotationObjectIdLinks'

function getObjectIdLink(id: string): string | undefined {
  if (id.startsWith(GO_PREFIX)) {
    return `${GO}${id}`
  }
  if (id.startsWith(UNIPROTKB_PREFIX)) {
    return `${UNIPROTKB}${id.replace(UNIPROTKB_PREFIX, '')}`
  }
  if (id.startsWith(CHEBI_PREFIX)) {
    return `${CHEBI}${id.replace(CHEBI_PREFIX, '')}`
  }
  if (id.startsWith(UBERON_PREFIX)) {
    return `${UBERON}${id.replace(UBERON_PREFIX, '')}`
  }
  if (id.startsWith(CDPO_PREFIX)) {
    return CDPO
  }
  if (id.startsWith(CL_PREFIX)) {
    return `${CL}${id.replace(CL_PREFIX, '')}`
  }
  if (id.startsWith(PDB_PREFIX)) {
    return `${PDB}${id.replace(PDB_PREFIX, '')}`
  }
  return undefined
}

export function ObjectIdLink({ id }: { id: string }) {
  const link = getObjectIdLink(id)

  if (link) {
    return (
      <Link to={link} className="text-light-sds-color-primitive-blue-500">
        {id}
      </Link>
    )
  }

  return <span>{id}</span>
}
