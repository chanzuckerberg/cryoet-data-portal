import Skeleton from '@mui/material/Skeleton'

import { useIsLoading } from 'app/hooks/useIsLoading'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

export function DatasetKeyPhoto({
  datasetTitle,
  src,
}: {
  datasetTitle: string
  src?: string
}) {
  const isLoading = useIsLoading()
  const containerClassName =
    'min-w-[134px] min-h-[100px] max-w-[134px] max-h-[100px]'

  if (isLoading) {
    return <Skeleton className={containerClassName} variant="rounded" />
  }

  return (
    <div
      className={cns(
        containerClassName,
        'flex items-center justify-center bg-[#d9d9d9]',

        // crop image to container dimensions
        'overflow-hidden object-cover',
      )}
    >
      {src ? (
        <img alt={`key visualization for dataset ${datasetTitle}`} src={src} />
      ) : (
        <p className="text-sds-gray-400 text-sm">{i18n.keyPhoto}</p>
      )}
    </div>
  )
}
