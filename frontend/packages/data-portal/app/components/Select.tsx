import {
  DefaultDropdownMenuOption,
  DropdownMenu,
  Icon,
  InputDropdown,
} from '@czi-sds/components'
import { ReactNode, useMemo, useState } from 'react'

import { cns } from 'app/utils/cns'

import { Tooltip, TooltipProps } from './Tooltip'

export interface SelectOption {
  key: string
  value: string
  label?: string
}

export function Select({
  activeKey,
  className,
  label,
  onChange,
  options,
  showActiveValue = true,
  showDetails = true,
  title,
  tooltip,
  tooltipProps,
}: {
  activeKey: string | null
  className?: string
  label: string
  onChange(key: string | null): void
  options: SelectOption[]
  showActiveValue?: boolean
  showDetails?: boolean
  title?: string
  tooltip?: ReactNode
  tooltipProps?: Partial<TooltipProps>
}) {
  const activeOption = useMemo(
    () => options.find((option) => option.key === activeKey ?? null),
    [activeKey, options],
  )

  const labelMap = useMemo(
    () =>
      Object.fromEntries(
        options.map((option) => [option.label ?? option.key, option.key]),
      ),
    [options],
  )

  const sdsOptions = options.map<DefaultDropdownMenuOption>((option) => ({
    name: option.label ?? option.key,
    details: showDetails ? option.value : undefined,
  }))

  const activeSdsOption =
    sdsOptions.find((option) => labelMap[option.name] === activeOption?.key) ??
    null

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className={cns('flex flex-col gap-sds-xxs', className)}>
      <div className="flex items-center gap-sds-xxs">
        {title && (
          <p className="text-sds-header-xs leading-sds-header-xs font-semibold">
            {title}:
          </p>
        )}

        {tooltip && (
          <Tooltip tooltip={tooltip} {...tooltipProps}>
            <Icon
              className="!fill-sds-gray-500 hover:!fill-sds-primary-400"
              sdsIcon="infoCircle"
              sdsSize="xs"
              sdsType="static"
            />
          </Tooltip>
        )}
      </div>

      <InputDropdown
        className={cns(
          'w-full !bg-white hover:!border-sds-primary-400',
          open && '!border-sds-primary-400',
        )}
        label={label}
        sdsStage="userInput"
        shouldPutAColonAfterLabel={false}
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
          setOpen(true)
        }}
        value={showActiveValue ? activeOption?.value ?? '' : undefined}
      />

      <DropdownMenu
        open={open}
        options={sdsOptions}
        value={activeSdsOption}
        anchorEl={anchorEl}
        onChange={(_, option) =>
          onChange(option ? labelMap[option.name] : null)
        }
        onClickAway={() => {
          setAnchorEl(null)
          setOpen(false)
        }}
      />
    </div>
  )
}
