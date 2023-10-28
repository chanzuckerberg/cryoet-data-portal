import Skeleton from '@mui/material/Skeleton'

import { useIsLoading } from 'app/hooks/useIsLoading'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

export function KeyPhoto({ src, title }: { src?: string; title: string }) {
  const { isLoadingDebounced } = useIsLoading()
  const containerClassName = 'flex-shrink-0 basis-[134px] aspect-[4/3]'

  if (isLoadingDebounced) {
    return <Skeleton className={containerClassName} variant="rounded" />
  }

  return (
    <div
      className={cns(
        containerClassName,
        'flex items-center justify-center bg-[#d9d9d9]',
        'rounded-sds-m',

        // crop image to container dimensions
        'overflow-hidden object-cover',
      )}
    >
      {src ? (
        <img alt={`key visualization for ${title}`} src={src} />
      ) : (
        <p className="text-sds-gray-400 text-sm">{i18n.keyPhoto}</p>
      )}
    </div>
  )
}
