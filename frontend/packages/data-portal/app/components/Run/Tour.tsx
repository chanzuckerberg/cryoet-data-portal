import React from "react";
import Joyride, { Step } from "react-joyride";
import { Icon } from "@czi-sds/components";

interface CustomTourProps {
  steps: Step[];
  run: boolean;
  onClose: () => void;
}

const outlinedButtonStyles = "py-1.5 px-3 rounded-sds-l font-semibold border border-[#0B68F8] text-[#0B68F8]";
const filledButtonStyles = "py-1.5 px-3 rounded-sds-l font-semibold bg-[#0B68F8] text-white";

const CustomTooltip = (props: any, onClose: () => void) => {
  const { index, isLastStep, size, step, closeProps, backProps, primaryProps } = props;

  const tooltipContainerStyles = index === 0 || isLastStep ? "p-10 max-w-[650px]" : "p-4 max-w-[320px]";
  const titleStyles = index === 0 ? "text-[22px] leading-[30px]" : "text-base leading-6";
  const buttonContainerStyles = index === 0 || isLastStep ? "mt-10" : "mt-6";

  return (
    <div className={`bg-white rounded ${tooltipContainerStyles}`}>
      <div className="flex justify-between items-center">
        <div className={`font-semibold ${titleStyles}`}>{step.title}</div>
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

      <div className={`flex justify-between items-center ${buttonContainerStyles}`}>
        {index > 0 && (
          <p className="text-[#767676] text-sm">
            Step {index} of {size - 1}
          </p>
        )}

        <div className="flex gap-2 ml-auto">
          {index === 0 ? (
            <>
              <button {...closeProps} onClick={onClose} className={outlinedButtonStyles}>
                Close
              </button>
              <button {...primaryProps} className={filledButtonStyles}>
                Take a Tour
              </button>
            </>
          ) : (
            <>
              {index > 0 && (
                <button {...backProps} className={outlinedButtonStyles}>
                  Previous
                </button>
              )}
              <button {...primaryProps} className={filledButtonStyles}>
                {isLastStep ? "Close tour" : "Next"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Tour: React.FC<CustomTourProps> = ({ steps, run, onClose }) => {
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      disableScrolling
      floaterProps={{ hideArrow: true }}
      tooltipComponent={(props) => CustomTooltip(props, onClose)}
    />
  );
};

export default Tour;