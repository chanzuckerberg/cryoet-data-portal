import Tab from '@mui/material/Tab'
import MUITabs, { TabsProps } from '@mui/material/Tabs'

import { cns } from 'app/utils/cns'

export interface TabData<T extends string> {
  label: string
  value: T
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: Pick<TabsProps, 'className' | 'classes'> & {
  onChange(value: T): void
  tabs: TabData<T>[]
  value: T
}) {
  return (
    // Use Material UI tabs because SDS tabs have bug where styles aren't
    // rendered correctly within a modal.
    <MUITabs
      value={value}
      onChange={(_, nextTab: T) => onChange(nextTab)}
      classes={{
        // Translate to overlap with bottom gray border used in different places
        // in the UI.
        root: 'translate-y-[2px]',
        indicator: 'bg-sds-primary-500',
        flexContainer: 'gap-sds-xl',
      }}
    >
      {tabs.map((tab) => (
        <Tab
          classes={{
            root: cns(
              'text-sds-gray-500 text-sds-body-s',
              'leading-sds-body-s font-semibold',
              '!p-0 !min-w-[max-content]',
              'transition-colors',
            ),
            selected: '!text-black',
          }}
          key={tab.value}
          {...tab}
        />
      ))}
    </MUITabs>
  )
}
