import { KeyPhoto } from './KeyPhoto'
import { KeyPhotoCaption } from './KeyPhotoCaption/KeyPhotoCaption'
import { Link } from './Link'

export interface HeaderKeyPhotoProps {
  title: string
  url?: string
  caption?: React.ReactNode | null | undefined
  overlayContent?: React.ReactNode
}

export function HeaderKeyPhoto({
  caption,
  url,
  title,
  overlayContent,
}: HeaderKeyPhotoProps) {
  if (url === undefined) {
    return <KeyPhoto title={title} />
  }

  return (
    <div className="max-w-[465px] grow">
      {overlayContent ? (
        <>
          <KeyPhoto title={title} src={url} overlayContent={overlayContent} />
          <KeyPhotoCaption caption={caption} />
        </>
      ) : (
        <Link to={url}>
          <KeyPhoto title={title} src={url} />
          <KeyPhotoCaption caption={caption} />
        </Link>
      )}
    </div>
  )
}
