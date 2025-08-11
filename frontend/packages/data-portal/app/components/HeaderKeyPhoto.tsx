import { KeyPhoto } from './KeyPhoto'
import { KeyPhotoCaption } from './KeyPhotoCaption/KeyPhotoCaption'

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
  return (
    <div className="max-w-[465px] grow">
      {url ? (
        <>
          <KeyPhoto title={title} src={url} overlayContent={overlayContent} />
          <KeyPhotoCaption caption={caption} />
        </>
      ) : (
        <KeyPhoto title={title} />
      )}
    </div>
  )
}
