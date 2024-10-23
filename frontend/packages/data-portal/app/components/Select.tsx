import {
  DefaultAutocompleteOption,
  DropdownMenu,
  Icon,
  InputDropdown,
  SDSAutocompleteOnChange,
} from '@czi-sds/components'
import { AutocompleteClasses } from '@mui/material/Autocomplete'
import { PopperProps } from '@mui/material/Popper'
import {
  ReactNode,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from 'react'

import { cns } from 'app/utils/cns'

import { Tooltip, TooltipProps } from './Tooltip'

export interface SelectOption {
  key: string
  value: string
  label?: string
  component?: JSX.Element
}

export function Select({
  activeKey,
  className,
  dropdownClasses,
  dropdownPopperBaseProps,
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
  dropdownClasses?: Partial<AutocompleteClasses>
  dropdownPopperBaseProps?: Partial<PopperProps>
  label: ReactNode
  onChange(key: string | null): void
  options: SelectOption[]
  showActiveValue?: boolean
  showDetails?: boolean
  title?: string
  tooltip?: ReactNode
  tooltipProps?: Partial<TooltipProps>
}) {
  const activeOption = useMemo(
    () => options.find((option) => option.key === activeKey),
    [activeKey, options],
  )

  const labelMap = useMemo(
    () =>
      Object.fromEntries(
        options.map((option) => [option.label ?? option.key, option.key]),
      ),
    [options],
  )

  const sdsOptions = options.map<DefaultAutocompleteOption>((option) =>
    option.component !== undefined
      ? {
          name: option.label ?? option.key,
          component: option.component,
        }
      : {
          name: option.label ?? option.key,
          details: showDetails ? option.value : undefined,
        },
  )

  const activeSdsOption =
    sdsOptions.find((option) => labelMap[option.name] === activeOption?.key) ??
    null

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)

  const closeDropdown = useCallback(() => {
    setAnchorEl(null)
    setOpen(false)
  }, [])

  const handleOnChange = useCallback<
    SDSAutocompleteOnChange<DefaultAutocompleteOption, false, false, false>
  >(
    (
      _event: SyntheticEvent<Element, Event>,
      option: DefaultAutocompleteOption | null,
    ) => {
      onChange(option ? labelMap[option.name] : null)
      closeDropdown()
    },
    [closeDropdown, labelMap, onChange],
  )

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
              className="!fill-sds-color-primitive-gray-500 hover:!fill-sds-color-primitive-blue-400"
              sdsIcon="InfoCircle"
              sdsSize="xs"
              sdsType="static"
            />
          </Tooltip>
        )}
      </div>

      <InputDropdown
        // For some reason input dropdown says `className` is not defined even though it is.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        className={cns(
          'w-full !bg-white hover:!border-sds-color-primitive-blue-400',
          open && '!border-sds-color-primitive-blue-400',
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
        onClose={closeDropdown}
        onChange={handleOnChange}
        onClickAway={closeDropdown}
        // This hides the search bar in the dropdown menu since it's not used anywhere yet.
        className="hidden"
        classes={{
          ...dropdownClasses,
          popper: cns(
            '[&_.MuiButtonBase-root]:!px-sds-s [&_.MuiButtonBase-root]:!py-sds-xs',
            dropdownClasses?.popper,
          ),
        }}
        PopperBaseProps={{
          ...dropdownPopperBaseProps,
          style: { width: anchorEl?.clientWidth },
        }}
      />
    </div>
  )
}
