import { Link } from 'app/components/Link'
import {
  GO,
  GO_PREFIX,
  UNIPROTKB,
  UNIPROTKB_PREFIX,
} from 'app/constants/annotationObjectIdLinks'

export function ObjectIdLink({ id }: { id: string }) {
  let link
  if (id.startsWith(GO_PREFIX)) {
    link = `${GO}${id}`
  } else if (id.startsWith(UNIPROTKB_PREFIX)) {
    link = `${UNIPROTKB}${id.replaceAll('UniProtKB:', '')}`
  }
  // don't link if no patterns match
  if (link) {
    return (
      <Link to={link} className="text-light-sds-color-primitive-blue-400">
        {id}
      </Link>
    )
  }

  return <span>{id}</span>
}
