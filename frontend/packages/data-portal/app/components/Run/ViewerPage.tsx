import './ViewerPage.css'

import { currentState, NeuroglancerWrapper, updateState } from 'neuroglancer'
import { useState, useEffect } from 'react'
import { cns } from 'app/utils/cns'
import { CryoETHomeLink } from '../Layout/CryoETHomeLink'
import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { Button } from '@czi-sds/components'
import { InfoIcon } from 'app/components/icons'
import { MenuItemLink } from "app/components/MenuItemLink";
import { CustomDropdown, CustomDropdownSection, CustomDropdownOption } from '../common/CustomDropdown'
import { ABOUT_LINKS, HELP_AND_REPORT_LINKS, NEUROGLANCER_HELP_LINKS } from '../Layout/constants'
import { useI18n } from 'app/hooks/useI18n'

// Button action for toggling layers visibility
const isAnnotation = (layer: any) =>
  layer.type === 'annotation' || layer.type === 'segmentation'
const toggleVisibility = (layer: any) =>
  !(layer.visible === undefined || layer.visible)

// const toggleLayersVisibility = () => {
//   updateState((state) => {
//     for (const layer of state.neuroglancer.layers) {
//       layer.visible = toggleVisibility(layer)
//     }
//     return state
//   })
// }

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

const toggleBoundingBox = () => {
  updateState((state) => {
    state.neuroglancer.showDefaultAnnotations = toggleAnnotations();
    return state
  })
}

const hasAnnotationLayers = (state: any) => {
  const root = state.neuroglancer || state
  return root.layers.some(isAnnotation)
}

function ViewerPage({ run } : { run: any }) {
  const { t } = useI18n()
  const state = currentState().neuroglancer;
  const [hasAnnotations, setHasAnnotations] = useState(
    hasAnnotationLayers(currentState()),
  )
  const [annotations, setAnnotations] = useState<any>([])

  const updateButtons = (state: any) => {
    setHasAnnotations(hasAnnotationLayers(state))
  }

  useEffect(() => {
    const filteredAnnotations = state.layers.filter((layer: any) => layer.type === "annotation");

    setAnnotations(filteredAnnotations);
  }, []);

  const activeBreadcrumbText = (
    <p>
      {run.name} <span className='text-sds-color-primitive-common-white opacity-60'>(#RN-{run.id})</span>
    </p>
  );

  return (
    <div className="main-container">
      <nav
        className={cns('bg-sds-color-primitive-common-black text-sds-color-primitive-common-white',
          'flex flex-shrink-0 items-center py-1',
          'sticky top-0 z-30 max-h-12',
        )}
      >
        <div className="flex items-center gap-4">
          <CryoETHomeLink textSize="text-sm" />
          <Breadcrumbs variant="neuroglancer" data={run.dataset} type="breadcrumb-light" activeBreadcrumbText={activeBreadcrumbText} />
        </div>
        {/* Add empty space to push content to right */}
        <div className="basis-sds-xxl flex-grow screen-790:mr-sds-xxl" />
        <div className="hidden screen-716:flex basis-auto flex-shrink-0">
          <div className="flex items-center gap-1">
            <CustomDropdown title="Annotations" variant="outlined">
              <CustomDropdownSection title="Toggle annotations per deposition">
                <CustomDropdownOption selected={false} onSelect={() => toggleAnnotations()}>All annotations</CustomDropdownOption>
                {annotations.map((annotation: any) => (
                  <CustomDropdownOption
                    key={annotation?.name}
                    selected={true}
                    onSelect={() => console.log(annotation)}
                  >
                    <span>{annotation?.name}</span>
                    <span className="text-xs text-[#767676] font-normal">#CZCDP-12795</span>
                  </CustomDropdownOption>
                ))}
              </CustomDropdownSection>
            </CustomDropdown>
            <CustomDropdown title="Layout" variant="outlined">
              <CustomDropdownSection title="Layout">
                <CustomDropdownOption selected={false} onSelect={() => console.log("4 panel")}>4 panel</CustomDropdownOption>
                <CustomDropdownOption selected={false} onSelect={() => console.log("XY")}>XY</CustomDropdownOption>
                <CustomDropdownOption selected={false} onSelect={() => console.log("XZ")}>XZ</CustomDropdownOption>
                <CustomDropdownOption selected={false} onSelect={() => console.log("YZ")}>YZ</CustomDropdownOption>
                <CustomDropdownOption selected={false} onSelect={() => console.log("3D")}>3D</CustomDropdownOption>
              </CustomDropdownSection>
              <CustomDropdownSection title="Toggle Panels">
                <CustomDropdownOption selected={false} onSelect={() => console.log("All panels")}>All panels</CustomDropdownOption>
                <CustomDropdownOption selected={false} onSelect={() => console.log("Top layer bar")}>Top layer bar</CustomDropdownOption>
              </CustomDropdownSection>
            </CustomDropdown>
            <CustomDropdown title="Actions" variant="outlined">
              <CustomDropdownSection title="Appearance">
                <CustomDropdownOption selected={false} onSelect={() => toggleBoundingBox()}>Bounding box</CustomDropdownOption>
                <CustomDropdownOption selected={false} onSelect={() => console.log("Axis lines")}>Axis lines</CustomDropdownOption>
                <CustomDropdownOption selected={false} onSelect={() => console.log("Scale bar")}>Scale bar</CustomDropdownOption>
                <CustomDropdownOption selected={false} onSelect={() => console.log("Change background to white")}>Change background to white</CustomDropdownOption>
              </CustomDropdownSection>
              <CustomDropdownSection title="Move">
                <CustomDropdownOption selected={false} onSelect={() => console.log("Snap to the nearest axis")}>Snap to the nearest axis</CustomDropdownOption>
              </CustomDropdownSection>
            </CustomDropdown>
            <Button sdsType="primary" sdsStyle="rounded">Share</Button>
            <CustomDropdown className='w-11 h-11 p-3' buttonElement={<InfoIcon className="w-5 h-5" />}>
              <CustomDropdownSection title="About">
                {ABOUT_LINKS.map((option) => (
                  <MenuItemLink key={option.label} to={option.link}>
                    {t(option.label)}
                  </MenuItemLink>
                ))}
              </CustomDropdownSection>
              <CustomDropdownSection title="Help & Support">
                {HELP_AND_REPORT_LINKS.map((option) => (
                  <MenuItemLink key={option.label} to={option.link}>
                    {t(option.label)}
                  </MenuItemLink>
                ))}
              </CustomDropdownSection>
              <CustomDropdownSection title="Neuroglancer help">
                {NEUROGLANCER_HELP_LINKS.map((option) => (
                  <MenuItemLink key={option.label} to={option.link}>
                    {t(option.label)}
                  </MenuItemLink>
                ))}
              </CustomDropdownSection>
            </CustomDropdown>
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
