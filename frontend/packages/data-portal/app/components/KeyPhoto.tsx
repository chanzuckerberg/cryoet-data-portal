import Skeleton from '@mui/material/Skeleton'
import { match, P } from 'ts-pattern'

import { KeyPhotoFallbackIcon } from 'app/components/icons'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

export function KeyPhoto({
  className,
  loading = false,
  src,
  title,
  overlayOnGroupHover,
}: {
  className?: string
  loading?: boolean
  src?: string
  title: string
  overlayOnGroupHover?: boolean
}) {
  const { t } = useI18n()

  return (
    <div
      className={cns(
        'flex-shrink-0 basis-[134px] aspect-[4/3] min-w-[134px]',
        'flex items-center justify-center bg-sds-gray-100',
        'rounded-sds-m',

        // crop image to container dimensions
        'overflow-hidden object-cover',
        overlayOnGroupHover && [
          'relative',
          'before:absolute',
          'before:bg-black',
          'group-hover:before:bg-opacity-70',
          'group-hover:before:w-full',
          'group-hover:before:h-full',
          'group-hover:before:text-sds-body-s',
          'group-hover:before:flex-wrap',
          'group-hover:before:content-center',
          'group-hover:before:content-i18n',
          'group-hover:before:text-sds-gray-white',
          'group-hover:before:font-semibold',
          'group-hover:before:text-center',
        ],
        className,
      )}
      // eslint-disable-next-line react/no-unknown-property
      i18n-content={t('openDataset')}
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
          <KeyPhotoFallbackIcon className="text-sds-gray-200 font-normal aspect-square w-1/5" />
        ))}
    </div>
  )
}
