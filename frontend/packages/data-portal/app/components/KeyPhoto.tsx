import Skeleton from '@mui/material/Skeleton'
import { match, P } from 'ts-pattern'

import { KeyPhotoFallbackIcon } from 'app/components/icons'
import { useI18n } from 'app/hooks/useI18n'
import { I18nKeys } from 'app/types/i18n'
import { cns } from 'app/utils/cns'

export function KeyPhoto({
  className,
  loading = false,
  src,
  title,
  textOnGroupHover,
  overlayContent,
  variant = 'table',
}: {
  className?: string
  loading?: boolean
  src?: string
  title: string
  textOnGroupHover?: I18nKeys
  overlayContent?: React.ReactNode
  variant?: 'table' | 'header'
}) {
  const { t } = useI18n()
  return (
    <div
      className={cns(
        'flex-shrink-0 w-full',
        variant === 'table'
          ? 'max-w-[134px] max-h-[100px]'
          : 'max-w-[465px] max-h-[330px]',
        'flex items-center justify-center bg-light-sds-color-primitive-gray-100',
        'rounded-sds-m',
        'overflow-hidden object-cover',
        'relative',
        'group',
        textOnGroupHover && [
          'before:absolute',
          'before:bg-black',
          'group-hover:before:bg-opacity-30',
          'group-hover:before:w-full',
          'group-hover:before:h-full',
          'group-hover:before:text-sds-body-s-400-wide',
          'group-hover:before:flex-wrap',
          'group-hover:before:content-center',
          'group-hover:before:content-i18n',
          'group-hover:before:text-light-sds-color-primitive-gray-50',
          'group-hover:before:font-semibold',
          'group-hover:before:text-center',
        ],
        className,
      )}
      data-i18n-content={textOnGroupHover ? t(textOnGroupHover) : ''}
    >
      {overlayContent && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 transition-all opacity-0 group-hover:opacity-100">
          {overlayContent}
        </div>
      )}
      {match([src, loading])
        .with([P._, true], () => <Skeleton variant="rounded" className="z-0" />)
        .with([P.string, false], () => (
          <img
            alt={`key visualization for ${title}`}
            src={src}
            className="w-full z-0"
          />
        ))
        .otherwise(() => (
          <KeyPhotoFallbackIcon className="text-light-sds-color-primitive-gray-200 font-normal aspect-square w-1/5 z-0" />
        ))}
    </div>
  )
}
