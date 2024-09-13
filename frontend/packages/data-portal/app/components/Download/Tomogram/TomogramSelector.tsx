import { ReactNode, useMemo } from 'react'

import { Select, SelectOption } from 'app/components/Select'
import { Tomogram } from 'app/context/DownloadModal.context'
import { cns } from 'app/utils/cns'

import { TomogramSelectorInputLabel } from './TomogramSelectorLabel'
import { TomogramSelectorOption } from './TomogramSelectorOption'

export interface TomogramSelectorProps {
  title: string
  tooltip?: ReactNode
  className?: string

  selectedTomogram?: Tomogram
  allTomograms?: Tomogram[]

  onSelectTomogramId: (id: string) => void
}

export function TomogramSelector({
  title,
  tooltip,
  className,
  selectedTomogram,
  allTomograms = [],
  onSelectTomogramId,
}: TomogramSelectorProps) {
  return (
    <Select
      title={title}
      tooltip={tooltip}
      className={cns('flex-grow', className)}
      dropdownClasses={{
        popper: 'max-h-[325px] !p-sds-xs overflow-y-auto',
        listbox: '!pr-0',
      }}
      dropdownPopperBaseProps={{
        className: '!p-0',
      }}
      activeKey={selectedTomogram?.id.toString() ?? null}
      label={<TomogramSelectorInputLabel tomogram={selectedTomogram} />}
      options={allTomograms.map((tomogram) => ({
        key: tomogram.id.toString(),
        value: tomogram.id.toString(),
        component: <TomogramSelectorOption tomogram={tomogram} />,
      }))}
      onChange={onSelectTomogramId}
      showActiveValue={false}
      showDetails={false}
    />
  )
}
