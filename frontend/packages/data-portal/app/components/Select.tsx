import {
  DefaultAutocompleteOption,
  DropdownMenu,
  Icon,
  InputDropdown,
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

// Overloaded interface for different modes
export interface SelectPropsBase {
  className?: string
  dropdownClasses?: Partial<AutocompleteClasses>
  dropdownPopperBaseProps?: Partial<PopperProps>
  label: ReactNode
  options: SelectOption[]
  search?: boolean
  showActiveValue?: boolean
  showDetails?: boolean
  title?: ReactNode
  tooltip?: ReactNode
  tooltipProps?: Partial<TooltipProps>
}

export interface SingleSelectProps extends SelectPropsBase {
  multiple?: false
  activeKey?: string | null
  onChange(key: string | null): void
}

export interface MultiSelectProps extends SelectPropsBase {
  multiple: true
  activeKeys: string[]
  onChange(keys: string[]): void
}

export type SelectProps = SingleSelectProps | MultiSelectProps

export function Select(props: SelectProps) {
  const {
    className,
    dropdownClasses,
    dropdownPopperBaseProps,
    label,
    multiple = false,
    options,
    showActiveValue = true,
    showDetails = true,
    title,
    tooltip,
    tooltipProps,
    search = false,
  } = props

  // Type-safe access to props based on multiple mode
  const activeKey = multiple ? null : (props as SingleSelectProps).activeKey
  const activeKeys = useMemo(
    () => (multiple ? (props as MultiSelectProps).activeKeys : []),
    [multiple, props],
  )
  const onChange = multiple
    ? (props as MultiSelectProps).onChange
    : (props as SingleSelectProps).onChange

  const activeOptions = useMemo(() => {
    if (multiple) {
      return options.filter((option) => activeKeys.includes(option.key))
    }
    return options.filter((option) => option.key === activeKey)
  }, [multiple, activeKeys, activeKey, options])

  const labelMap = useMemo(
    () =>
      Object.fromEntries(
        options.map((option) => [option.label ?? option.key, option.key]),
      ),
    [options],
  )

  // For multi-select, show checkmarks next to selected items
  const sdsOptions = useMemo(() => {
    return options.map<DefaultAutocompleteOption>((option) => {
      if (option.component !== undefined) {
        return {
          name: option.label ?? option.key,
          component: option.component,
        }
      }

      return {
        name: option.label ?? option.key,
        details: showDetails ? option.value : undefined,
      }
    })
  }, [options, showDetails])

  const activeSdsOptions = useMemo(() => {
    if (multiple) {
      return sdsOptions.filter((option) =>
        activeKeys.includes(labelMap[option.name]),
      )
    }
    const activeOption = options.find((option) => option.key === activeKey)
    const singleActiveSdsOption =
      sdsOptions.find(
        (option) => labelMap[option.name] === activeOption?.key,
      ) ?? null
    return singleActiveSdsOption ? [singleActiveSdsOption] : []
  }, [multiple, activeKeys, activeKey, options, sdsOptions, labelMap])

  const activeSdsOption = multiple ? null : activeSdsOptions[0] ?? null

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)

  const closeDropdown = useCallback(() => {
    setAnchorEl(null)
    setOpen(false)
  }, [])

  const handleOnChange = useCallback(
    (
      event: SyntheticEvent<Element, Event>,
      option: DefaultAutocompleteOption | DefaultAutocompleteOption[] | null,
    ) => {
      // Prevent default behavior that might close the dropdown
      event.preventDefault()
      event.stopPropagation()

      if (!option) return

      if (multiple && Array.isArray(option)) {
        // Multi-select mode: option is an array of all selected options
        const selectedKeys = option
          .map((opt) => labelMap[opt.name])
          .filter(Boolean) // Remove any undefined keys

        const multiOnChange = onChange as (keys: string[]) => void
        multiOnChange(selectedKeys)
      } else if (!multiple && !Array.isArray(option)) {
        // Single-select mode: option is a single option
        const selectedKey = labelMap[option.name]
        if (!selectedKey) return

        const singleOnChange = onChange as (key: string | null) => void
        singleOnChange(selectedKey)
      }
    },
    [multiple, onChange, labelMap],
  )

  // Generate display value
  const displayValue = useMemo(() => {
    if (!showActiveValue) return undefined

    if (multiple) {
      if (activeOptions.length === 0) {
        return 'None'
      }

      // Show count when multiple items are selected
      if (activeOptions.length === 1) {
        return activeOptions[0].label ?? activeOptions[0].key
      }

      return (
        <span className="bg-light-sds-color-primitive-blue-300 text-light-sds-color-primitive-blue-600 text-sds-body-xxxs-600-wide leading-sds-body-xxxs px-sds-xs rounded">
          {activeOptions.length}
        </span>
      )
    }

    return activeOptions[0]?.value ?? 'None'
  }, [showActiveValue, multiple, activeOptions])

  return (
    <div className={cns('flex flex-col gap-sds-xxs', className)}>
      <div className="flex items-center gap-sds-xxs">
        {title && (
          <p className="text-sds-header-xs-600-wide leading-sds-header-xs font-semibold">
            {title}:
          </p>
        )}

        {tooltip && (
          <Tooltip role="tooltip" tooltip={tooltip} {...tooltipProps}>
            <Icon
              className="!fill-light-sds-color-primitive-gray-500 hover:!fill-light-sds-color-primitive-blue-500"
              sdsIcon="InfoCircle"
              sdsSize="xs"
            />
          </Tooltip>
        )}
      </div>

      <InputDropdown
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        className={cns(
          'w-full !bg-white hover:!border-light-sds-color-primitive-blue-500',
          open && '!border-light-sds-color-primitive-blue-500',
        )}
        label={label}
        sdsStage="userInput"
        counter={multiple ? activeSdsOptions.length : false}
        multiple={multiple}
        shouldPutAColonAfterLabel={false}
        onClick={(event) => {
          setAnchorEl(event.currentTarget)
          setOpen(true)
        }}
        value={displayValue}
      />

      <DropdownMenu
        open={open}
        options={sdsOptions}
        value={multiple ? activeSdsOptions : activeSdsOption}
        anchorEl={anchorEl}
        onClose={closeDropdown}
        // @ts-expect-error sds types are not correct

        onChange={handleOnChange}
        onClickAway={closeDropdown}
        search={search}
        multiple={multiple} // Tell DropdownMenu to operate in multi-select mode
        disableCloseOnSelect // Never close on select for both modes
        className={cns(!search && 'hidden')}
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
