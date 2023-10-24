import { Tab, TabProps, Tabs as SDSTabs } from '@czi-sds/components'

export interface TabData<T extends string> {
  label: string
  value: T
}

export function Tabs<T extends string>({
  onChange,
  tabs,
  ...props
}: Pick<TabProps, 'className' | 'classes'> & {
  onChange(value: T): void
  tabs: TabData<T>[]
  value: T
}) {
  return (
    // TODO fix TypeScript issue upstream. For some reason the Tabs component is
    // requiring every prop to be passed rather than making it optional.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <SDSTabs
      sdsSize="large"
      onChange={(_, nextTab: T) => onChange(nextTab)}
      {...props}
    >
      {tabs.map((tab) => (
        <Tab key={tab.value} {...tab} />
      ))}
    </SDSTabs>
  )
}
