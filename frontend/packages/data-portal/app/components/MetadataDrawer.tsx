import { Button, Icon } from '@czi-sds/components'
import { usePrevious } from '@react-hookz/web'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'

import { Drawer } from 'app/components/Drawer'
import { TabData, Tabs } from 'app/components/Tabs'
import { TestIds } from 'app/constants/testIds'
import { useI18n } from 'app/hooks/useI18n'
import {
  MetadataDrawerId,
  MetadataTab,
  useMetadataDrawer,
} from 'app/hooks/useMetadataDrawer'
import { Events, usePlausible } from 'app/hooks/usePlausible'
import { I18nKeys } from 'app/types/i18n'
import { cns } from 'app/utils/cns'

interface MetaDataDrawerProps {
  disabled?: boolean
  drawerId: MetadataDrawerId
  idInfo?: { label: I18nKeys; text: string }
  label: string
  onClose?(): void
  renderHowToCiteTab?(): ReactNode
  renderMetadataTab?(): ReactNode
  title: string
}

export function MetadataDrawer({
  disabled,
  drawerId,
  idInfo,
  label,
  onClose,
  renderHowToCiteTab,
  renderMetadataTab,
  title,
}: MetaDataDrawerProps) {
  const drawer = useMetadataDrawer()

  const { t } = useI18n()

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

  const tabs = useMemo<TabData<MetadataTab>[]>(
    () => [
      ...(renderMetadataTab
        ? [
            {
              label: t('metadata'),
              value: MetadataTab.Metadata,
            },
          ]
        : []),

      ...(renderHowToCiteTab
        ? [
            {
              label: t('howToCite'),
              value: MetadataTab.HowToCite,
            },
          ]
        : []),
    ],
    [renderHowToCiteTab, renderMetadataTab, t],
  )

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <div
        className="flex flex-col flex-auto"
        data-testid={TestIds.MetadataDrawer}
      >
        <header className="flex items-start justify-between px-sds-xl pt-sds-xl pb-sds-xxl">
          <div className="flex flex-col">
            <p className="text-xs text-light-sds-color-semantic-base-text-secondary font-semibold uppercase mb-sds-s">
              {label}
            </p>

            <p className="text-sds-header-xl-600-wide font-semibold text-black leading-sds-header-xl line-clamp-3">
              {title}
            </p>

            {idInfo && (
              <p className="flex flex-row gap-sds-xs items-baseline text-light-sds-color-semantic-base-text-secondary">
                <span className="text-sds-header-xxs-600-wide leading-sds-header-xxs font-semibold">
                  {t(idInfo.label)}:
                </span>
                <span className="text-sds-body-s-400-wide leading-sds-body-s">
                  {idInfo.text}
                </span>
              </p>
            )}
          </div>

          <Button
            onClick={handleClose}
            data-testid={TestIds.MetadataDrawerCloseButton}
            className="!min-w-[36px] !min-h-[36px] !max-w-[36px] !max-h-[36px]"
            sdsStyle="icon"
            icon={
              <Icon
                className="!fill-light-sds-color-primitive-gray-500"
                sdsIcon="XMark"
                sdsSize="l"
              />
            }
          />
        </header>

        <div className="px-sds-xl border-b-2 border-light-sds-color-primitive-gray-200">
          <Tabs
            className="!m-0"
            tabs={tabs}
            value={drawer.activeTab ?? MetadataTab.Metadata}
            onChange={(value) => drawer.setActiveTab(value)}
          />
        </div>

        <div
          className={cns(
            'flex flex-col flex-auto',
            'px-sds-xl pt-sds-xl pb-sds-xxl',

            drawer.activeTab === MetadataTab.Metadata &&
              'divide-y divide-light-sds-color-primitive-gray-300',
          )}
        >
          {drawer.activeTab === MetadataTab.Metadata && renderMetadataTab?.()}

          {drawer.activeTab === MetadataTab.HowToCite && renderHowToCiteTab?.()}
        </div>
      </div>
    </Drawer>
  )
}
