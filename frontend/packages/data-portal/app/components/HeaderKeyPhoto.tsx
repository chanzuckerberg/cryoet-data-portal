import { KeyPhoto } from './KeyPhoto'
import { Link } from './Link'

export interface HeaderKeyPhotoProps {
  title: string
  url?: string
}

export function HeaderKeyPhoto({ url, title }: HeaderKeyPhotoProps) {
  return (
    <div className="max-w-[465px] max-h-[330px] grow overflow-clip rounded-sds-m flex-shrink-0 flex items-center">
      {url !== undefined ? (
        <Link to={url}>
          <KeyPhoto title={title} src={url} />
        </Link>
      ) : (
        <KeyPhoto title={title} />
      )}
    </div>
  )
}
