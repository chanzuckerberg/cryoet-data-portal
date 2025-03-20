import { Step } from "react-joyride";

export const steps: Step[] = [
  {
    target: 'body',
    placement: 'center',
    title: 'Exploring CryoET Data in Neuroglancer',
    disableBeacon: true, 
    content: (
      <div className="flex flex-col gap-6 mt-6">
        <div className="p-6 bg-[#EBEBEB] rounded"></div>
          <div>
            <p className="mb-10">The CryoET Data Portal provides an interactive data viewer powered by Neuroglancer for visualizing and analyzing volumetric cryo-electron tomography (CryoET) data and annotations.</p>
            <p>Let’s run through some key aspects of the data viewer and essential controls.</p>
          </div>
       </div>
    )
  },
  {
    target: '.neuroglancer-side-panel',
    placement: 'center',
    title: 'Main viewport',
    disableBeacon: true,
    content: (
      <div className="flex flex-col gap-6 mt-6">
      </div>
    )
  }
]