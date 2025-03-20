import React from "react";
import Joyride, { CallBackProps, Step } from "react-joyride";
import { Icon } from '@czi-sds/components';

interface CustomTourProps {
  steps: Step[];
  run: boolean;
  onJoyrideCallback: (data: CallBackProps) => void;
  onClose: () => void;
}

const Tour: React.FC<CustomTourProps> = ({ steps, run, onJoyrideCallback, onClose }) => {

  const outlinedStyles = "py-1.5 px-3 rounded-[20px] font-semibold border border-[#0B68F8] text-[#0B68F8]"
  const filledStyles = "py-1.5 px-3 rounded-[20px] font-semibold bg-[#0B68F8] text-white"

  return (
    <Joyride
      steps={steps}
      run={run}
      callback={onJoyrideCallback}
      continuous
      tooltipComponent={(props) => (
        <div className={`bg-white rounded-sm ${props.index === 0 ? "p-10 min-w-[650px]" : "p-4 min-w-[320px]"}`}>
          <div className="flex justify-between items-center">
            <div className={`font-semibold ${props.index === 0 ? "text-[22px] leading-[30px]" : "text-base leading-6"}`}>{props.step.title}</div>
            <button onClick={onClose}>
              <Icon sdsIcon="XMark" sdsType="button" sdsSize="s" className="!text-[#767676]" />
            </button>
          </div>
          <p>{props.step.content}</p>
          <div className={`flex justify-between items-center ${props.index === 0 ? "mt-10" : "mt-6"}`}>
            {props.index !== 0 && <p className="text-[#767676] text-sm">Step {props.index} of {props.size}</p>}
            <div className="flex gap-2 ml-auto">
              {props.index === 0 ? (
                <>
                  <button {...props.closeProps} onClick={onClose} className={outlinedStyles}>
                    Close
                  </button>
                  <button {...props.primaryProps} className={filledStyles}>
                    Take a Tour
                  </button>
                </>
              ) : (
              <>
                {props.index > 0 && (
                  <button {...props.backProps} className={outlinedStyles}>
                    Previous
                  </button>
                )}
                <button {...props.primaryProps} className={filledStyles} onClick={onClose}>
                  {props.isLastStep ? "Close tour" : "Next"}
                </button>
              </>
              )}
            </div>
          </div>
        </div>
      )}
    />
  )
}

export default Tour;