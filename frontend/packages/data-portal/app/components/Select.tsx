import {
  DefaultDropdownMenuOption,
  DropdownMenu,
  InputDropdown,
} from '@czi-sds/components'
import { useMemo, useState } from 'react'

import { cns } from 'app/utils/cns'

export interface SelectOption {
  key: string
  value: string
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
}: {
  activeKey: string | null
  className?: string
  label: string
  onChange(key: string | null): void
  options: SelectOption[]
  showActiveValue?: boolean
  showDetails?: boolean
  title?: string
}) {
  const activeOption = useMemo(
    () => options.find((option) => option.key === activeKey ?? null),
    [activeKey, options],
  )

  const sdsOptions = options.map<DefaultDropdownMenuOption>((option) => ({
    name: option.key,
    details: showDetails ? option.value : undefined,
  }))

  const activeSdsOption =
    sdsOptions.find((option) => option.name === activeOption?.key) ?? null

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className={cns('flex flex-col gap-sds-xxs', className)}>
      {title && (
        <p className="text-sds-header-xs leading-sds-header-xs font-semibold">
          {title}:
        </p>
      )}

      <InputDropdown
        className="w-full"
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
        onChange={(_, option) => onChange(option?.name ?? null)}
        onClickAway={() => {
          setAnchorEl(null)
          setOpen(false)
        }}
      />
    </div>
  )
}
