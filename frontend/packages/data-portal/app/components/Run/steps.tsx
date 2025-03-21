import { Step } from 'react-joyride'

const getIframeElement = (selector: string): HTMLElement | string => {
  const iframe = document.querySelector('iframe')
  if (iframe?.contentDocument) {
    return iframe.contentDocument.querySelector(selector) as HTMLElement | 'body'
  }
  return 'body'
}


export const getTutorialSteps: () => Step[] = () => [
  {
    target: '.neuroglancer-iframe',
    placement: 'center',
    title: 'Exploring CryoET Data in Neuroglancer',
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
            Let's run through some key aspects of the data viewer and essential
            controls.
          </p>
        </div>
      </div>
    ),
  },
  {
    target: getIframeElement('.neuroglancer-side-panel'),
    title: 'Main viewport',
    content: (
      <div className="flex flex-col gap-6 mt-1">
        <div className="text-[#767676]">
          <p>The default visualization is a synchronized four panel layout:</p>
          <ul className="list-disc ps-5">
            <li>Three cross-sectional views showing orthogonal XY, XZ, and YZ slices</li>
            <li>One 3D view for model visualization and volume rendering</li>
          </ul>
        </div>
        <p className='text-black'>This is configurable from the 'Layout' dropdown in the top bar.</p>
      </div>
    ),
  },
  {
    target: getIframeElement('.neuroglancer-side-panel'),
    title: 'Essential controls',
    placement: 'bottom',
    content: (
      <div className="flex flex-col gap-6 mt-1">
        <p className='text-black'>This is configurable from the 'Layout' dropdown in the top bar.</p>
      </div>
    ),
  },
  {
    target: '.button-group',
    title: 'Keyboard shortcuts',
    content: (
      <div className="flex flex-col gap-6 mt-1">
        <p className='text-black'>This is configurable from the 'Layout' dropdown in the top bar.</p>
      </div>
    ),
  },
]
