import { Link } from 'app/components/Link'
import {
  GO,
  GO_PATTERN,
  UNIPROTKB,
  UNIPROTKB_PATTERN,
} from 'app/constants/annotationObjectIdLinks'

export function ObjectIdLink({ id }: { id: string }) {
  let link
  if (id.match(GO_PATTERN)) {
    link = `${GO}${id}`
  } else if (id.match(UNIPROTKB_PATTERN)) {
    link = `${UNIPROTKB}${id.replaceAll('UniProtKB:', '')}`
  }
  // don't link if no patterns match
  if (link) {
    return (
      <Link to={link} className="text-sds-primary-400">
        {id}
      </Link>
    )
  }

  return <span>{id}</span>
}
