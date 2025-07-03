import { Icon } from '@czi-sds/components'
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  ORIGIN,
  STATUS,
  Step,
  TooltipRenderProps,
} from 'react-joyride'

import { cns } from 'app/utils/cns'
import { useLayoutEffect, useState } from 'react'

const ProxyOverlay: React.FC<{
  targetSelector: string
  className: string
  stepIndex: number
}> = ({ targetSelector, className, stepIndex }) => {
  const [style, setStyle] = useState<React.CSSProperties | undefined>(undefined)
  // Note might want to use useLayoutEffect here
  useLayoutEffect(() => {
    const updatePosition = () => {
      const iframe = document.querySelector(
        'iframe',
      ) as HTMLIFrameElement | null
      const target = iframe?.contentDocument?.querySelector(
        targetSelector,
      ) as HTMLElement | null
      if (!iframe || !target) return

      console.log('Updating position for:', targetSelector)
      const iframeRect = iframe.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()

      setStyle({
        position: 'absolute',
        top: targetRect.top + iframeRect.top,
        left: targetRect.left + iframeRect.left,
        width: targetRect.width,
        height: targetRect.height,
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      })
      return true
    }

    window.addEventListener('resize', updatePosition)
    updatePosition()

    return () => {
      window.removeEventListener('resize', updatePosition)
    }
  }, [targetSelector, stepIndex])

  console.log('Rendering ProxyOverlay for:', targetSelector)
  const sanitizedSelector = targetSelector.replace(/[^a-zA-Z0-9-_:.]/g, '-')
  return <div className={className} id={sanitizedSelector} style={style} />
}

export const ProxyOverlayWrapper: React.FC<{
  selectors: { target: string; className: string }[]
  stepIndex: number
}> = ({ selectors, stepIndex }) => {
  // Get the unique target selectors from the steps
  console.log('ProxyOverlayWrapper selectors:', selectors)
  return (
    <>
      {selectors.map((selector) => (
        <ProxyOverlay
          targetSelector={selector.target}
          className={selector.className}
          stepIndex={stepIndex}
          key={selector.target + selector.className + stepIndex}
        />
      ))}
    </>
  )
}

interface CustomTourProps {
  steps: Step[]
  run: boolean
  stepIndex: number
  onRestart: () => void
  onClose: () => void
  onMove: (
    index: number,
    action: (typeof ACTIONS)[keyof typeof ACTIONS],
  ) => void
  proxySelectors: { target: string; className: string }[]
  proxyIndex: number
}

const outlinedButtonStyles =
  'py-1.5 px-3 rounded-sds-l font-semibold border border-[#0B68F8] text-[#0B68F8]'
const filledButtonStyles =
  'py-1.5 px-3 rounded-sds-l font-semibold bg-[#0B68F8] text-white'

function CustomTooltip(
  props: TooltipRenderProps,
  onRestart: () => void,
  onClose: () => void,
) {
  const { index, isLastStep, size, step, closeProps, backProps, primaryProps } =
    props

  const tooltipContainerStyles =
    index === 0 || isLastStep ? 'p-10 max-w-[650px]' : 'p-4 max-w-[334px]'
  const titleStyles =
    index === 0 ? 'text-[22px] leading-[30px]' : 'text-base leading-6'
  const buttonContainerStyles = index === 0 || isLastStep ? 'mt-10' : 'mt-6'

  return (
    <div className={cns(tooltipContainerStyles, 'bg-white rounded')}>
      <div className="flex justify-between items-center">
        <div className={cns(titleStyles, 'font-semibold')}>{step.title}</div>
        <button
          type="button"
          onClick={onClose}
          className="w-4 h-4 flex items-center"
        >
          <Icon sdsIcon="XMark" sdsSize="s" className="!text-[#767676]" />
        </button>
      </div>

      <p>{step.content}</p>

      <div
        className={cns(
          buttonContainerStyles,
          'flex justify-between items-center',
        )}
      >
        {index > 0 && (
          <p className="text-[#767676] text-sm">
            Step {index} of {size - 1}
          </p>
        )}

        <div className="flex gap-2 ml-auto">
          {index === 0 ? (
            <>
              <button
                type="button"
                {...closeProps}
                onClick={onClose}
                className={outlinedButtonStyles}
              >
                Close
              </button>
              <button
                type="button"
                {...primaryProps}
                className={filledButtonStyles}
              >
                Take a tour
              </button>
            </>
          ) : (
            <>
              {index > 0 && !isLastStep && (
                <button
                  type="button"
                  {...backProps}
                  className={outlinedButtonStyles}
                >
                  Previous
                </button>
              )}
              {index > 0 && isLastStep && (
                <button
                  type="button"
                  onClick={onRestart}
                  className={outlinedButtonStyles}
                >
                  Restart
                </button>
              )}
              {!isLastStep && (
                <button
                  type="button"
                  {...primaryProps}
                  className={filledButtonStyles}
                >
                  Next
                </button>
              )}
              {isLastStep && (
                <button
                  type="button"
                  onClick={onClose}
                  className={filledButtonStyles}
                >
                  Close tour
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function Tour({
  steps,
  run,
  stepIndex,
  onRestart,
  onClose,
  onMove,
  proxySelectors,
  proxyIndex,
}: CustomTourProps) {
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, origin, status, type } = data

    if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
      onClose()
    }

    if (
      ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)
    ) {
      onMove(index, action)
    } else if (
      ([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)
    ) {
      onClose()
    }
  }

  return (
    <div>
      <ProxyOverlayWrapper selectors={proxySelectors} stepIndex={proxyIndex} />
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        spotlightClicks
        spotlightPadding={0}
        continuous
        disableOverlayClose
        disableScrolling
        floaterProps={{ hideArrow: true }}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
        callback={handleJoyrideCallback}
        tooltipComponent={(props) => CustomTooltip(props, onRestart, onClose)}
      />
    </div>
  )
}
