import './ViewerPage.css'

import { currentState, NeuroglancerWrapper, updateState } from 'neuroglancer'
import { useState } from 'react'
import { cns } from 'app/utils/cns'
import { CryoETHomeLink } from '../Layout/CryoETHomeLink'
import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { Button } from '@czi-sds/components'
import { InfoIcon } from 'app/components/icons'
import { CustomDropdown } from '../common/CustomDropdown'
import { ABOUT_LINKS, HELP_AND_REPORT_LINKS, NEUROGLANCER_HELP_LINKS } from '../Layout/constants'

// Button action for toggling layers visibility
const isAnnotation = (layer: any) =>
  layer.type === 'annotation' || layer.type === 'segmentation'
const toggleVisibility = (layer: any) =>
  !(layer.visible === undefined || layer.visible)

const toggleLayersVisibility = () => {
  updateState((state) => {
    for (const layer of state.neuroglancer.layers) {
      layer.visible = toggleVisibility(layer)
    }
    return state
  })
}

const toggleAnnotations = () => {
  updateState((state) => {
    for (const layer of state.neuroglancer.layers) {
      if (isAnnotation(layer)) {
        layer.visible = toggleVisibility(layer)
      }
    }
    return state
  })
}

const hasAnnotationLayers = (state: any) => {
  const root = state.neuroglancer || state
  return root.layers.some(isAnnotation)
}

function ViewerPage({ run } : { run: any }) {
  const [hasAnnotations, setHasAnnotations] = useState(
    hasAnnotationLayers(currentState()),
  )

  const updateButtons = (state: any) => {
    setHasAnnotations(hasAnnotationLayers(state))
  }

  const activeBreadcrumbText = (
    <p>
      {run.name} <span className='text-sds-color-primitive-common-white opacity-60'>(#RN-{run.id})</span>
    </p>
  );

  return (
    <div className="main-container">
      <nav
        className={cns('bg-sds-color-primitive-common-black text-sds-color-primitive-common-white',
          'flex py-sds-m flex-shrink-0 items-center px-sds-xl',
          'sticky top-0 z-30',
        )}
      >
        <div className="flex items-center gap-4">
          <CryoETHomeLink />
          <Breadcrumbs variant="run" data={run.dataset} type="breadcrumb-light" classname="text-[13px]" activeBreadcrumbText={activeBreadcrumbText} />
        </div>
        {/* Add empty space to push content to right */}
        <div className="basis-sds-xxl flex-grow screen-790:mr-sds-xxl" />
        <div className="hidden screen-716:flex basis-auto flex-shrink-0">
          <div className="flex items-center gap-1">
            <CustomDropdown 
              title="Annotations" 
              variant="outlined"
              sections={[
                {
                  title: "Toggle annotations per deposition",
                  options: [
                    {label: "All annotations", checked: false},
                    {label: "Deposition #1", subLabel: "#CZCDP-12795", checked: false},
                    {label: "Deposition #2", subLabel: "#CZCDP-12796", checked: false},
                    {label: "Deposition #3", subLabel: "#CZCDP-12797", checked: false}
                  ]
                }
              ]}
            />
            <CustomDropdown 
              title="Layout" 
              variant="outlined"
              sections={[
                {
                  title: "Layout", 
                  options: [
                    {label: "4 panel", checked: false}, 
                    {label: "XY", checked: false}, 
                    {label: "XZ", checked: false},
                    {label: "YZ", checked: false},
                    {label: "3D", checked: false}
                  ]
                },
                {
                  title: "Toggle Panels",
                  options: [
                    {label: "All panels", checked: false},
                    {label: "Top layer bar", checked: false}
                  ]
                }
              ]}
            />
            <CustomDropdown 
              title="Actions" 
              variant="outlined"
              sections={[
                {
                  title: "Appearance",
                  options: [
                    {label: "Bounding box", checked: false},
                    {label: "Axis lines", checked: false},
                    {label: "Scale bar", checked: false},
                    {label: "Change background to white", checked: false}
                  ]
                },
                {
                  title: "Move",
                  options: [
                    {label: "Snap to the nearest axis", checked: false}
                  ]
                }
              ]}
            />
            <Button sdsType="primary" sdsStyle="rounded">Share</Button>
            <CustomDropdown
              buttonElement={<InfoIcon className="w-5 h-5" />}
              className='w-11 h-11 p-3'
              sections={[
                {title: "About", links: ABOUT_LINKS},
                {title: "Help & Support", links: HELP_AND_REPORT_LINKS},
                {title: "Neuroglancer help", links: NEUROGLANCER_HELP_LINKS}
              ]}
            />
          </div>
        </div>
      </nav>
      <div className="iframe-container">
        <NeuroglancerWrapper onStateChange={updateButtons} />
      </div>
    </div>
  )
}

export default ViewerPage
