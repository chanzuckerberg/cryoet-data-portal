import Skeleton from '@mui/material/Skeleton'
import { match, P } from 'ts-pattern'

import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

export function KeyPhoto({
  loading,
  src,
  title,
}: {
  loading?: boolean
  src?: string
  title: string
}) {
  return (
    <div
      className={cns(
        'flex-shrink-0 basis-[134px] aspect-[4/3]',
        'flex items-center justify-center bg-[#d9d9d9]',
        'rounded-sds-m',

        // crop image to container dimensions
        'overflow-hidden object-cover',
      )}
    >
      {match([src, loading])
        .with([P._, true], () => <Skeleton variant="rounded" />)
        .with([P.string, false], () => (
          <img alt={`key visualization for ${title}`} src={src} />
        ))
        .otherwise(() => (
          <p className="text-sds-gray-400 text-sm">{i18n.keyPhoto}</p>
        ))}
    </div>
  )
}
