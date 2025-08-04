// TODO path imports not working in unit tests
// eslint-disable-next-line cryoet-data-portal/no-root-mui-import
import { Tab, Tabs as MUITabs, TabsProps } from '@mui/material'
import { ReactNode } from 'react'

import { cns } from 'app/utils/cns'

import { Tooltip } from './Tooltip'

export interface TabData<T> {
  value: T
  label: ReactNode
  disabled?: boolean
  tooltip?: ReactNode
}

export function Tabs<T>({
  className,
  onChange,
  tabs,
  value,
  vertical,
}: Pick<TabsProps, 'className' | 'classes'> & {
  onChange(value: T): void
  tabs: TabData<T>[]
  value: T
  vertical?: boolean
}) {
  return (
    // Use Material UI tabs because SDS tabs have bug where styles aren't
    // rendered correctly within a modal.
    <div className={cns('flex items-center', className)}>
      <MUITabs
        value={value}
        onChange={(_, nextTab: T) => onChange(nextTab)}
        classes={{
          // Translate to overlap with bottom gray border used in different places
          // in the UI.
          root: 'translate-y-[2px] !min-h-0 w-full',
          indicator: cns(
            '!bg-light-sds-color-primitive-blue-500',
            vertical && 'hidden',
          ),
          flexContainer: cns('!pb-sds-xxs', !vertical && 'gap-sds-xl'),
        }}
        orientation={vertical ? 'vertical' : 'horizontal'}
      >
        {tabs.map((tab) => {
          let tabComponent = (
            <Tab
              // adding the div wrapper breaks the onChange in the MUI tab, so
              // we need to do it manually here
              onClick={() => {
                if (vertical) {
                  onChange(tab.value)
                }
              }}
              classes={{
                root: cns(
                  'text-light-sds-color-primitive-gray-500 !text-sds-body-s-400-wide',
                  '!leading-sds-body-s !font-semibold',
                  '!p-0 !min-w-[max-content] !min-h-0',
                  'transition-colors',
                  tab.disabled && 'opacity-100 !text-[#ccc]',
                  vertical && [
                    'w-[calc(100%-6px)]',
                    '!px-sds-xl !h-10 group',
                    'hover:bg-light-sds-color-semantic-base-fill-hover',
                    tab.value === value && '!bg-[#edf3fd]',
                  ],
                ),
                selected: '!text-black',
              }}
              key={String(tab.value)}
              {...tab}
            />
          )

          if (vertical) {
            tabComponent = (
              <div className="flex flex-auto items-center justify-between group">
                {tabComponent}

                {/*
                we have to render a custom indicator for vertical tabs because
                MUI doesn't support showing a hover indicator, only for the
                active tab
              */}
                {vertical && (
                  <div
                    className={cns(
                      'h-10 w-[6px]',

                      tab.value === value
                        ? 'bg-light-sds-color-primitive-blue-500'
                        : 'group-hover:bg-light-sds-color-semantic-base-border-primary',
                    )}
                  />
                )}
              </div>
            )
          }

          if (tab.tooltip) {
            tabComponent = (
              <Tooltip
                key={String(tab.value)}
                tooltip={tab.tooltip}
                placement="top"
                sdsStyle="dark"
              >
                {tabComponent}
              </Tooltip>
            )
          }

          return tabComponent
        })}
      </MUITabs>
    </div>
  )
}
