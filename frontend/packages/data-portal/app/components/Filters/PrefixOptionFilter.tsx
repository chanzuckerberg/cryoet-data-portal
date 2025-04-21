import { DropdownMenu, Icon, InputText } from '@czi-sds/components'
import { useRef, useState } from 'react'

import {
  PrefixOption,
  usePrefixValueContext,
} from 'app/components/AnnotationFilter/ObjectIdFilter/PrefixValueContext'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { Link } from '../Link'

export interface PrefixOptionFilterProps {
  id: string
  label: string
  value: string
  onChange(value: string): void
  hideLabel?: boolean
  className?: string
  error?: boolean
  prefixOptions: PrefixOption[]
}

export function PrefixOptionFilter({
  id,
  label,
  onChange,
  value,
  hideLabel,
  className,
  error,
  prefixOptions,
}: PrefixOptionFilterProps) {
  const [focused, setFocused] = useState(false)
  const [inputHover, setInputHover] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [open, setOpen] = useState(false)

  const {
    prefixValue,
    setPrefixValue,
    inputDropdownValue,
    setInputDropdownValue,
  } = usePrefixValueContext()

  const inputRef = useRef<HTMLInputElement | null>(null)
  const { t } = useI18n()

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    if (open) {
      setOpen(false)
      if (anchorEl) {
        anchorEl.focus()
      }
      if (inputRef?.current) {
        inputRef.current.focus()
      }
      setAnchorEl(null)
    } else {
      setAnchorEl(event.currentTarget)
      setOpen(true)
    }
  }

  function handleChange(
    _: React.SyntheticEvent<Element, Event>,
    newValue: string | PrefixOption | null,
  ) {
    setOpen(false)
    if (typeof newValue === 'object' && newValue !== null) {
      setPrefixValue(newValue)
      setInputDropdownValue(newValue.name)
    } else {
      setPrefixValue(null)
      setInputDropdownValue(null)
    }
  }

  function handleClickAway() {
    if (open) {
      setOpen(false)
    }
  }
  return (
    <>
      <div className="relative flex group">
        <button
          onClick={handleClick}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          type="button"
          className={cns(
            'group focus:!border-light-sds-color-primitive-grey-500 top-0 left-0 flex items-center h-[32px] px-2 bg-light-sds-color-primitive-gray-100 z-[1] relative font-semibold text-sds-header-s-400-wide border-t border-l border-b rounded-tl-sds-m rounded-bl-sds-m border-light-sds-color-primitive-gray-400',
            error
              ? 'group-focus-within:border-light-sds-color-primitive-red-600'
              : !focused &&
                  'group-focus-within:border-light-sds-color-primitive-blue-500',
            inputHover && 'border-light-sds-color-primitive-gray-900',
          )}
        >
          {inputDropdownValue}{' '}
          <Icon
            className="ml-sds-xxs group-hover:!fill-light-sds-color-semantic-base-ornament-primary"
            sdsIcon="TriangleDown"
            sdsSize="xs"
            color={open ? 'blue' : 'gray'}
            shade={open ? 500 : 600}
          />
        </button>
        <InputText
          ref={inputRef}
          id={id}
          label={label}
          onChange={(event) => onChange(event.target.value)}
          onMouseOver={() => setInputHover(true)}
          onMouseLeave={() => setInputHover(false)}
          placeholder={prefixValue?.placeholder || ''}
          value={value}
          hideLabel={hideLabel}
          className={cns(
            'relative border-light-sds-color-primitive-gray-400 !mb-sds-xs !mr-0 left-[-3px] w-[195px]',
            className,
          )}
          intent={error ? 'negative' : undefined}
        />
      </div>
      <DropdownMenu
        width={245} // matching the width of the input
        open={open}
        anchorEl={anchorEl}
        onClose={() => {}}
        // @ts-expect-error sds types are not correct
        // eslint-disable-next-line react/jsx-no-bind
        onChange={handleChange}
        disableCloseOnSelect
        options={prefixOptions}
        value={prefixValue}
        onClickAway={() => handleClickAway()}
      />
      {prefixValue && (
        <div className="text-sds-header-xxs-600-wide leading-sds-header-xxs">
          <span className="font-semibold">{prefixValue.details}: </span>
          <Link
            variant="dashed-underlined"
            className="text-light-sds-color-primitive-gray-700"
            to={prefixValue.link}
          >
            {' '}
            {t('learnMore')}
          </Link>
        </div>
      )}
    </>
  )
}
