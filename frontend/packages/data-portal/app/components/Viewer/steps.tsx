import { TFunction } from 'i18next'
import { Step } from 'react-joyride'

import { I18n, I18nProps } from 'app/components/I18n'
import { InfoIcon } from 'app/components/icons'
import { cns } from 'app/utils/cns'

import { NEUROGLANCER_DOC_LINK } from '../Layout/constants'

type Translator = TFunction<'translation', undefined>

interface StepContentProps {
  children: React.ReactNode
  variant: 'default' | 'simple' | 'minimal' | 'compact'
  className?: string
}

const essentialControls = (t: Translator) => [
  {
    key: 'CTRL',
    action: t('neuroglancerWTCtls.scrollPinch.action'),
    description: t('neuroglancerWTCtls.scrollPinch.description'),
  },
  {
    key: 'Shift',
    action: t('neuroglancerWTCtls.scroll.action'),
    description: t('neuroglancerWTCtls.scroll.description'),
  },
  {
    action: t('neuroglancerWTCtls.leftClickDrag1.action'),
    description: t('neuroglancerWTCtls.leftClickDrag1.description'),
  },
  {
    action: t('neuroglancerWTCtls.leftClickDrag2.action'),
    description: t('neuroglancerWTCtls.leftClickDrag2.description'),
  },
  {
    key: 'Shift',
    action: t('neuroglancerWTCtls.clickDrag1.action'),
    description: t('neuroglancerWTCtls.clickDrag1.description'),
  },
  {
    key: 'Shift',
    action: t('neuroglancerWTCtls.clickDrag2.action'),
    description: t('neuroglancerWTCtls.clickDrag2.description'),
  },
]

const keyboardShortcuts = (t: Translator) => [
  { key: 'v', description: t('neuroglancerWTShortcuts.bbox') },
  { key: 'a', description: t('neuroglancerWTShortcuts.axisLines') },
  { key: 'b', description: t('neuroglancerWTShortcuts.scaleBar') },
  { key: 's', description: t('neuroglancerWTShortcuts.crossSection') },
]

export const proxyStepSelectors: { target: string; className: string }[] = [
  {
    target:
      '.neuroglancer-layer-group-viewer:has(.neuroglancer-rendered-data-panel)',
    className: 'joyride-proxy-layer-group-viewer',
  },
  {
    target:
      '.neuroglancer-side-panel:has(.neuroglancer-layer-list-panel-items)',
    className: 'joyride-proxy-side-panel',
  },
  {
    target: '.neuroglancer-layer-side-panel-tab-view',
    className: 'joyride-proxy-layer-side-panel-tab-view',
  },
  {
    target: '.neuroglancer-viewer-top-row',
    className: 'joyride-proxy-viewer-top-row',
  },
]

function TransTour(props: I18nProps) {
  return (
    <I18n
      components={{
        span: <span>tmp</span>,
        p: <p>tmp</p>,
        div: <div className="text-[#767676]">tmp</div>,
        ul: <ul className="list-disc ps-5">tmp</ul>,
        li: <li>tmp</li>,
        InfoIcon: <InfoIcon className="w-5 h-5" />,
        doclink: (
          <span className="font-semibold text-[#0B68F8]">
            <a href={NEUROGLANCER_DOC_LINK}>tmp</a>
          </span>
        ),
      }}
      {...props}
    />
  )
}

export const getTutorialSteps: (t: Translator) => Step[] = (t) => {
  return [
    {
      target: '#neuroglancerIframe',
      placement: 'center',
      disableBeacon: true,
      title: t('neuroglancerWT.main.title'),
      content: (
        <StepContent variant="default">
          <div className="p-6 bg-[#EBEBEB] rounded relative overflow-hidden min-h-[247px]">
            <div className="absolute left-6 right-6 rounded overflow-hidden">
              <img
                src="/images/neuroglancer_tour/viewer_example.png"
                alt="Portal viewer example"
                className="w-full rounded"
              />
            </div>
          </div>
          <p className="flex flex-col gap-10">
            <TransTour i18nKey="neuroglancerWT.main.content" />
          </p>
        </StepContent>
      ),
    },
    {
      target: '.joyride-proxy-layer-group-viewer',
      title: t('neuroglancerWT.step1.title'),
      placement: 'left-start',
      disableBeacon: true,
      content: (
        <StepContent variant="compact">
          <TransTour i18nKey="neuroglancerWT.step1.content" />
        </StepContent>
      ),
    },
    {
      target: '.joyride-proxy-layer-group-viewer',
      title: t('neuroglancerWT.step2.title'),
      placement: 'left-start',
      disableBeacon: true,
      content: (
        <StepContent variant="simple">
          <div className="mt-4 mb-4">
            <img
              src="/images/neuroglancer_tour/essential_controls.gif"
              title="Essential controls"
              alt="essential controls gif"
            />
          </div>
          <p className="text-[#767676]">
            <TransTour i18nKey="neuroglancerWT.step2.content" />
          </p>
          <div className="flex flex-col gap-3 mt-3">
            <KeyActionList actions={essentialControls(t)} />
          </div>
        </StepContent>
      ),
    },
    {
      target: '.joyride-proxy-layer-group-viewer',
      title: t('neuroglancerWT.step3.title'),
      placement: 'left-start',
      disableBeacon: true,
      content: (
        <StepContent variant="simple">
          <div className="mt-4 mb-4">
            <img
              src="/images/neuroglancer_tour/keyboard_shortcuts.gif"
              title="Keyboard shortcuts"
              alt="keyboard shortcuts gif"
            />
          </div>
          <p className="text-[#767676]">
            <TransTour i18nKey="neuroglancerWT.step3.content" />
          </p>
          <div className="flex flex-col gap-3 mt-3 mb-4">
            <KeyActionList actions={keyboardShortcuts(t)} />
          </div>
          <p>
            <TransTour i18nKey="neuroglancerWT.step3.complement" />
          </p>
        </StepContent>
      ),
    },
    {
      target: '.joyride-proxy-side-panel',
      title: t('neuroglancerWT.step4.title'),
      placement: 'right-start',
      disableBeacon: true,
      content: (
        <StepContent variant="simple">
          <div className="mt-4 mb-4">
            <img
              src="/images/neuroglancer_tour/layer_management.gif"
              title="Layer management"
              alt="layer management gif"
            />
          </div>
          <p className="text-[#767676] flex flex-col gap-4">
            <TransTour i18nKey="neuroglancerWT.step4.content" />
          </p>
        </StepContent>
      ),
    },
    {
      target: '.joyride-proxy-layer-side-panel-tab-view',
      title: t('neuroglancerWT.step5.title'),
      placement: 'right-start',
      disableBeacon: true,
      content: (
        <StepContent variant="minimal">
          <p className="text-[#767676]">
            <TransTour i18nKey="neuroglancerWT.step5.content" />
          </p>
        </StepContent>
      ),
    },
    {
      target: '.joyride-proxy-viewer-top-row',
      title: t('neuroglancerWT.step6.title'),
      placement: 'bottom-end',
      disableBeacon: true,
      content: (
        <StepContent variant="minimal">
          <p className="text-[#767676] flex flex-col gap-4">
            <span>
              <TransTour i18nKey="neuroglancerWT.step6.content" />
            </span>
          </p>
        </StepContent>
      ),
    },
    {
      target: '#neuroglancerIframe',
      placement: 'center',
      title: t('neuroglancerWT.step7.title'),
      disableBeacon: true,
      content: (
        <StepContent variant="default">
          <p className="flex flex-col gap-3">
            <TransTour i18nKey="neuroglancerWT.step7.content" />
          </p>
          <div className="flex flex-col gap-3">
            <TransTour i18nKey="neuroglancerWT.step7.recap" />
            <div className="rounded p-4 bg-[#F8F8F8] flex flex-col gap-3">
              <KeyActionList actions={essentialControls(t)} />
            </div>
          </div>
          <p>
            <TransTour i18nKey="neuroglancerWT.step7.learnMore" />
          </p>
          <p className="flex gap-1">
            <TransTour i18nKey="neuroglancerWT.step7.access" />
          </p>
        </StepContent>
      ),
    },
  ]
}

function StepContent({
  children,
  variant = 'default',
  className,
}: StepContentProps) {
  const variantStyles = {
    default: 'flex flex-col gap-6 mt-6',
    compact: 'flex flex-col gap-6',
    simple: 'flex flex-col',
    minimal: 'mt-1',
  }

  return (
    <div className={cns(variantStyles[variant], className)}>{children}</div>
  )
}

function KeyActionList({
  actions,
}: {
  actions: { key?: string; action?: string; description: string }[]
}) {
  return (
    <>
      {actions.map((control) => (
        <div
          key={`${control.description}`}
          className="flex items-center justify-between"
        >
          <p className="font-semibold text-xs font-mono whitespace-nowrap">
            {control.key && (
              <>
                <span className="bg-[#EBEBEB] py-0.5 px-1 rounded-sm">
                  {control.key}
                </span>
              </>
            )}
            {control.action && control.key && <span> + </span>}
            {control.action}
          </p>
          <p className="text-[#767676] text-xs text-right">
            {control.description}
          </p>
        </div>
      ))}
    </>
  )
}
