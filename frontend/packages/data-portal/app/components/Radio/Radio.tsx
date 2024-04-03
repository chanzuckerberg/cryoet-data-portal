import { InputRadio } from '@czi-sds/components'
import { createElement, MouseEvent, ReactNode } from 'react'

import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { DownloadConfig } from 'app/types/download'
import { cns } from 'app/utils/cns'

export function Radio({
  children,
  description,
  label,
  onClick,
  value,
}: {
  children?: ReactNode
  description: string
  label: string
  onClick?(): void
  value: DownloadConfig
}) {
  const { downloadConfig } = useDownloadModalQueryParamState()
  const isActive = downloadConfig === value

  return createElement(
    isActive ? 'div' : 'button',
    {
      className: cns(
        'flex gap-sds-default p-sds-l transition-colors text-left',

        isActive && 'bg-sds-gray-100',
      ),

      ...(isActive
        ? {}
        : {
            onClick(event: MouseEvent<HTMLButtonElement>) {
              event.stopPropagation()
              onClick?.()
            },
            type: 'button',
          }),
    },
    <>
      <InputRadio value={value} />

      <div className="flex flex-col gap-sds-xxxs !tracking-[0.3px]">
        <span className="text-sds-header-s leading-sds-header-s font-semibold">
          {label}
        </span>
        <span className="text-sds-gray-600 text-sds-body-xs leading-sds-body-xs">
          {description}
        </span>

        {isActive && children}
      </div>
    </>,
  )
}
