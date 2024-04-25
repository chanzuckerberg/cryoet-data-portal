import Skeleton from '@mui/material/Skeleton'
import { match, P } from 'ts-pattern'

import { KeyPhotoFallbackIcon } from 'app/components/icons'
import { cns } from 'app/utils/cns'

export function KeyPhoto({
  className,
  loading = false,
  src,
  title,
}: {
  className?: string
  loading?: boolean
  src?: string
  title: string
}) {
  return (
    <div
      className={cns(
        'flex-shrink-0 basis-[134px] aspect-[4/3] min-w-[134px]',
        'flex items-center justify-center bg-sds-gray-100',
        'rounded-sds-m',

        // crop image to container dimensions
        'overflow-hidden object-cover',

        className,
      )}
    >
      {match([src, loading])
        .with([P._, true], () => <Skeleton variant="rounded" />)
        .with([P.string, false], () => (
          <img
            alt={`key visualization for ${title}`}
            src={src}
            className="w-full"
          />
        ))
        .otherwise(() => (
          <KeyPhotoFallbackIcon className="text-sds-gray-200 aspect-square w-1/5" />
        ))}
    </div>
  )
}
