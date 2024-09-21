import { Button, Icon } from '@czi-sds/components'
import { usePrevious } from '@react-hookz/web'
import { ReactNode, useCallback, useEffect } from 'react'

import { Demo } from 'app/components/Demo'
import { Drawer } from 'app/components/Drawer'
import { TabData, Tabs } from 'app/components/Tabs'
import { TestIds } from 'app/constants/testIds'
import {
  MetadataDrawerId,
  MetadataTab,
  useMetadataDrawer,
} from 'app/hooks/useMetadataDrawer'
import { Events, usePlausible } from 'app/hooks/usePlausible'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

const TAB_OPTIONS: TabData<MetadataTab>[] = [
  {
    label: i18n.metadata,
    value: MetadataTab.Metadata,
  },
  // {
  //   label: i18n.howToCite,
  //   value: MetadataTab.HowToCite,
  // },
]

interface MetaDataDrawerProps {
  children: ReactNode
  disabled?: boolean
  drawerId: MetadataDrawerId
  label: string
  onClose?(): void
  title: string
}

export function MetadataDrawer({
  children,
  disabled,
  drawerId,
  label,
  onClose,
  title,
}: MetaDataDrawerProps) {
  const drawer = useMetadataDrawer()

  const handleClose = useCallback(() => {
    drawer.closeDrawer()
    onClose?.()
  }, [drawer, onClose])

  const isOpen = drawer.activeDrawer === drawerId && !disabled
  const prevIsOpen = usePrevious(isOpen)

  const plausible = usePlausible()
  useEffect(() => {
    if (typeof prevIsOpen === 'boolean' && prevIsOpen !== isOpen) {
      plausible(Events.ToggleMetadataDrawer, { type: drawerId, open: isOpen })
    }
  }, [drawerId, isOpen, plausible, prevIsOpen])

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <div
        className="flex flex-col flex-auto"
        data-testid={TestIds.MetadataDrawer}
      >
        <header className="flex items-start justify-between px-sds-xl pt-sds-xl pb-sds-xxl">
          <div className="flex flex-col gap-sds-s">
            <p className="text-xs text-sds-color-primitive-gray-600 font-semibold uppercase">
              {label}
            </p>

            <p className="text-sds-header-xl font-semibold text-black leading-sds-header-xl line-clamp-3">
              {title}
            </p>
          </div>

          <Button
            onClick={handleClose}
            data-testid={TestIds.MetadataDrawerCloseButton}
            className="!min-w-[36px] !min-h-[36px] !max-w-[36px] !max-h-[36px]"
          >
            <Icon
              className="!fill-sds-color-primitive-gray-500"
              sdsIcon="XMark"
              sdsSize="l"
              sdsType="button"
            />
          </Button>
        </header>

        <div className="px-sds-xl border-b-2 border-sds-color-primitive-gray-200">
          <Tabs
            className="!m-0"
            tabs={TAB_OPTIONS}
            value={drawer.activeTab ?? MetadataTab.Metadata}
            onChange={() => null}
          />
        </div>

        <div
          className={cns(
            'flex flex-col flex-auto',
            'px-sds-xl pt-sds-xl pb-sds-xxl',

            drawer.activeTab === MetadataTab.Metadata &&
              'divide-y divide-sds-color-primitive-gray-300',
          )}
        >
          {drawer.activeTab === MetadataTab.Metadata && children}

          {drawer.activeTab === MetadataTab.HowToCite && (
            <Demo>How to cite</Demo>
          )}
        </div>
      </div>
    </Drawer>
  )
}
