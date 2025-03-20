import { Step } from 'react-joyride'

const getIframeElement = (selector: string): HTMLElement | string => {
  const iframe = document.querySelector('iframe')
  if (iframe?.contentDocument) {
    return iframe.contentDocument.querySelector(selector) as HTMLElement
  }
  return 'body'
}

export const getTutorialSteps: () => Step[] = () => [
  {
    target: '.neuroglancer-iframe',
    placement: 'center',
    title: 'Exploring CryoET Data in Neuroglancer',
    disableBeacon: true,
    content: (
      <div className="flex flex-col gap-6 mt-6">
        <div className="p-6 bg-[#EBEBEB] rounded"></div>
        <div>
          <p className="mb-10">
            The CryoET Data Portal provides an interactive data viewer powered
            by Neuroglancer for visualizing and analyzing volumetric
            cryo-electron tomography (CryoET) data and annotations.
          </p>
          <p>
            Let’s run through some key aspects of the data viewer and essential
            controls.
          </p>
        </div>
      </div>
    ),
  },
  {
    target: getIframeElement('.neuroglancer-side-panel'),
    title: 'Main viewport',
    disableBeacon: true,
    // placement: 'center',
    content: <div className="flex flex-col gap-6 mt-6"></div>,
  },
]
