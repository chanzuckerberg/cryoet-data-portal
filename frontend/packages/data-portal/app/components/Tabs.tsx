import Tab from '@mui/material/Tab'
import MUITabs, { TabsProps } from '@mui/material/Tabs'
import { ReactNode } from 'react'

import { cns } from 'app/utils/cns'

export interface TabData<T> {
  label: ReactNode
  value: T
}

export function Tabs<T>({
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
    <div className="flex items-center">
      <MUITabs
        value={value}
        onChange={(_, nextTab: T) => onChange(nextTab)}
        classes={{
          // Translate to overlap with bottom gray border used in different places
          // in the UI.
          root: 'translate-y-[2px] !min-h-0',
          indicator: 'bg-sds-primary-500',
          flexContainer: 'gap-sds-xl !pb-sds-xxs',
        }}
      >
        {tabs.map((tab) => (
          <Tab
            classes={{
              root: cns(
                'text-sds-color-primitive-gray-500 !text-sds-body-s',
                '!leading-sds-body-s !font-semibold',
                '!p-0 !min-w-[max-content] !min-h-0',
                'transition-colors',
              ),
              selected: '!text-black ',
            }}
            key={String(tab.value)}
            {...tab}
          />
        ))}
      </MUITabs>
    </div>
  )
}
