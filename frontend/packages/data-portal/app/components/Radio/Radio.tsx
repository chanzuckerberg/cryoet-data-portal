import { InputRadio } from '@czi-sds/components'
import { createElement, MouseEvent, ReactNode } from 'react'

import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { DownloadConfig } from 'app/types/download'
import { cns } from 'app/utils/cns'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { Tooltip } from '../Tooltip'

export function Radio({
  children,
  description,
  label,
  disabled,
  disabledTooltip,
  onClick,
  value,
}: {
  children?: ReactNode
  description: string
  label: string
  disabled?: boolean
  disabledTooltip?: string
  onClick?(): void
  value: DownloadConfig
}) {
  const multipleTomogramsEnabled = useFeatureFlag('multipleTomograms')
  const { downloadConfig } = useDownloadModalQueryParamState()
  const isActive = downloadConfig === value

  const radioElement = createElement(
    isActive ? 'div' : 'button',
    {
      className: cns(
        'flex gap-sds-default p-sds-l transition-colors text-left',
        isActive && 'bg-sds-color-primitive-gray-100',
      ),
      ...(isActive
        ? {}
        : {
            onClick(event: MouseEvent<HTMLButtonElement>) {
              event.stopPropagation()
              if (!disabled) {
                onClick?.()
              }
            },
            type: 'button',
          }),
    },
    <>
      {/* Wrapper div so that radio is pushed to the top */}
      <div>
        <InputRadio value={value} disabled={disabled} />
      </div>

      <div
        className={cns(
          'flex flex-col gap-sds-xxxs !tracking-[0.3px]',
          multipleTomogramsEnabled && 'grow',
        )}
      >
        <span
          className={cns(
            'text-sds-header-s leading-sds-header-s font-semibold',
            disabled && '!text-[#c3c3c3]',
          )}
        >
          {label}
        </span>
        <span
          className={cns(
            'text-sds-body-xs leading-sds-body-xs',
            disabled ? '!text-[#c3c3c3]' : 'text-sds-color-primitive-gray-600',
          )}
        >
          {description}
        </span>

        {isActive && children}
      </div>
    </>,
  )

  return disabled && disabledTooltip !== undefined ? (
    <Tooltip tooltip={disabledTooltip} placement="top" sdsStyle="dark">
      {radioElement}
    </Tooltip>
  ) : (
    radioElement
  )
}
