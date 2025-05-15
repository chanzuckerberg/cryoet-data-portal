import React from 'react'
import Joyride, {
  Step,
  ACTIONS,
  STATUS,
  EVENTS,
  ORIGIN,
  CallBackProps,
} from 'react-joyride'
import { Icon } from '@czi-sds/components'
import { cns } from 'app/utils/cns'

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
}

const outlinedButtonStyles =
  'py-1.5 px-3 rounded-sds-l font-semibold border border-[#0B68F8] text-[#0B68F8]'
const filledButtonStyles =
  'py-1.5 px-3 rounded-sds-l font-semibold bg-[#0B68F8] text-white'

const CustomTooltip = (
  props: any,
  onRestart: () => void,
  onClose: () => void,
) => {
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
        <button onClick={onClose} className="w-4 h-4 flex items-center">
          <Icon
            sdsIcon="XMark"
            sdsType="button"
            sdsSize="s"
            className="!text-[#767676]"
          />
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
                {...closeProps}
                onClick={onClose}
                className={outlinedButtonStyles}
              >
                Close
              </button>
              <button {...primaryProps} className={filledButtonStyles}>
                Take a tour
              </button>
            </>
          ) : (
            <>
              {index > 0 && !isLastStep && (
                <button {...backProps} className={outlinedButtonStyles}>
                  Previous
                </button>
              )}
              {index > 0 && isLastStep && (
                <button onClick={onRestart} className={outlinedButtonStyles}>
                  Restart
                </button>
              )}
              {!isLastStep && (
                <button {...primaryProps} className={filledButtonStyles}>
                  Next
                </button>
              )}
              {isLastStep && (
                <button onClick={onClose} className={filledButtonStyles}>
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

const Tour: React.FC<CustomTourProps> = ({
  steps,
  run,
  stepIndex,
  onRestart,
  onClose,
  onMove,
}) => {
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

    console.groupCollapsed(type)
    console.log(data)
    console.groupEnd()
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
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
  )
}

export default Tour
