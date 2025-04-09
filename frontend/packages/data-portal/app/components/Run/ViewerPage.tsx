import './ViewerPage.css'

import { currentInternalState, currentNeuroglancerState, NeuroglancerWrapper, currentNeuroglancer, updateState } from 'neuroglancer'
import { useState } from 'react'
import { cns } from 'app/utils/cns'
import { CryoETHomeLink } from '../Layout/CryoETHomeLink'
import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { Button } from '@czi-sds/components'
import { InfoIcon } from 'app/components/icons'
import { MenuItemLink } from "app/components/MenuItemLink";
import { CustomDropdown, CustomDropdownSection, CustomDropdownOption } from '../common/CustomDropdown'
import { ABOUT_LINKS, REPORT_LINKS, NEUROGLANCER_HELP_LINKS } from '../Layout/constants'
import { useI18n } from 'app/hooks/useI18n'
import Snackbar from '../common/Snackbar'

const BACKGROUND_COLOR = "#ffffff"

// Button action for toggling layers visibility
const isAnnotation = (layer: any) =>
  layer.type === 'annotation' || layer.type === 'segmentation'
const toggleVisibility = (layer: any) =>
  !(layer.visible === undefined || layer.visible)

const boolValue = (value: boolean | undefined, defaultValue: boolean = true) => {
  return (value === undefined && defaultValue) || value
}

const changeBackgroundColor = (color: string) => {
  updateState((state) => {
    if (isBackgroundWhite()) {
      state.neuroglancer.crossSectionBackgroundColor = state.previousBackgroundColor
      return state
    }
    state.previousBackgroundColor = state.neuroglancer.crossSectionBackgroundColor
    state.neuroglancer.crossSectionBackgroundColor = color
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

const toggleLayer = (name: string) => {
  updateState((state) => {
    const layer = state.neuroglancer.layers.find((l: any) => l.name === name)
    if (layer) {
      const archived = boolValue(layer.archived, /* defaultValue =*/ false)
      layer.archived = !archived
      layer.visible = archived
    }
    return state
  })
}

const toggleBoundingBox = () => {
  updateState((state) => {
    state.neuroglancer.showDefaultAnnotations = !hasBoundingBox()
    return state
  })
}

const hasBoundingBox = () => {
  return boolValue(currentNeuroglancerState().showDefaultAnnotations)
}

const toggleAxisLine = () => {
  updateState((state) => {
    state.neuroglancer.showAxisLines = !axisLineEnabled()
    return state
  })
}

const axisLineEnabled = () => {
  return boolValue(currentNeuroglancerState().showAxisLines);
}

const hasAnnotationLayers = (state: any) => {
  return state.layers.some(isAnnotation)
}

const isBackgroundWhite = () => {
  return currentNeuroglancerState().crossSectionBackgroundColor === BACKGROUND_COLOR
}

const showScaleBarEnabled = () => {
  return boolValue(currentNeuroglancerState().showScaleBar)
}

const toggleShowScaleBar = () => {
  updateState((state) => {
    state.neuroglancer.showScaleBar = !showScaleBarEnabled()
    return state
  })
}

const currentLayout = () => {
  return currentNeuroglancerState().layout
}

const isCurrentLayout = (layout: string) => {
  return currentLayout() === layout
}

const setCurrentLayout = (layout: string) => {
  updateState((state) => {
    state.neuroglancer.layout = layout
    return state
  })
}

const snap = () => {
  const viewer = currentNeuroglancer();
  viewer.navigationState.pose.orientation.snap();
}

function ViewerPage({ run } : { run: any }) {
  const { t } = useI18n()
  const [renderVersion, setRenderVersion] = useState(0)
  const [shareClicked, setShareClicked] = useState<boolean>(false)

  const refresh = () => {
    setRenderVersion(renderVersion + 1)
  }

  const handleShareClick = () => {
    setShareClicked(true)
    setTimeout(() => {
      setShareClicked(false)
    }, 3000)
  }

  const activeBreadcrumbText = (
    <p>
      {run.name} <span className='text-sds-color-primitive-common-white opacity-60'>(#RN-{run.id})</span>
    </p>
  );

  return (
    <div className="flex flex-col overflow-hidden h-full relative">
      <nav
        className={cns('bg-sds-color-primitive-common-black text-sds-color-primitive-common-white',
          'flex flex-shrink-0 items-center py-1',
          'sticky top-0 z-30 max-h-12',
        )}
      >
        <div className="flex items-center gap-4">
          <CryoETHomeLink textSize="text-sm" />
          <Breadcrumbs variant="neuroglancer" data={run.dataset} type="light" activeBreadcrumbText={activeBreadcrumbText} />
        </div>
        {/* Add empty space to push content to right */}
        <div className="basis-sds-xxl flex-grow screen-790:mr-sds-xxl" />
        <div className="hidden screen-716:flex basis-auto flex-shrink-0">
          <div className="flex items-center gap-1">
            <CustomDropdown title="Annotations" variant="outlined">
              <CustomDropdownSection title="Toggle annotations per deposition">
                <CustomDropdownOption selected={false} onSelect={() => toggleAnnotations()}>All annotations</CustomDropdownOption>
                {currentNeuroglancerState().layers.filter((layer: any) => layer.type === "annotation").map((annotation: any) => (
                  <CustomDropdownOption
                    key={annotation.name}
                    selected={!boolValue(annotation.archived, /* defaultValue =*/ false)}
                    onSelect={() => toggleLayer(annotation.name)}
                  >
                    <span>{annotation?.name}</span>
                    <span className="text-xs text-[#767676] font-normal">#CZCDP-12795</span>
                  </CustomDropdownOption>
                ))}
              </CustomDropdownSection>
            </CustomDropdown>
            <CustomDropdown title="Layout" variant="outlined">
              <CustomDropdownSection title="Layout">
                <CustomDropdownOption selected={isCurrentLayout("4panel")} onSelect={() => setCurrentLayout("4panel")}>4 panel</CustomDropdownOption>
                <CustomDropdownOption selected={isCurrentLayout("xy")} onSelect={() => setCurrentLayout("xy")}>XY</CustomDropdownOption>
                <CustomDropdownOption selected={isCurrentLayout("xz")} onSelect={() => setCurrentLayout("xz")}>XZ</CustomDropdownOption>
                <CustomDropdownOption selected={isCurrentLayout("yz")} onSelect={() => setCurrentLayout("yz")}>YZ</CustomDropdownOption>
                <CustomDropdownOption selected={isCurrentLayout("3d")} onSelect={() => setCurrentLayout("3d")}>3D</CustomDropdownOption>
              </CustomDropdownSection>
              <CustomDropdownSection title="Toggle Panels">
                <CustomDropdownOption selected={false} onSelect={() => console.log("All panels")}>All panels</CustomDropdownOption>
                <CustomDropdownOption disabled selected={false} onSelect={() => console.log("Top layer bar")}>Top layer bar</CustomDropdownOption>
              </CustomDropdownSection>
            </CustomDropdown>
            <CustomDropdown title="Actions" variant="outlined">
              <CustomDropdownSection title="Appearance">
                <CustomDropdownOption selected={hasBoundingBox()} onSelect={toggleBoundingBox}>Bounding box</CustomDropdownOption>
                <CustomDropdownOption selected={axisLineEnabled()} onSelect={toggleAxisLine}>Axis lines</CustomDropdownOption>
                <CustomDropdownOption selected={showScaleBarEnabled()} onSelect={toggleShowScaleBar}>Scale bar</CustomDropdownOption>
                <CustomDropdownOption selected={isBackgroundWhite()} onSelect={() => changeBackgroundColor(BACKGROUND_COLOR)}>Change background to white</CustomDropdownOption>
              </CustomDropdownSection>
              <CustomDropdownSection title="Move">
                <CustomDropdownOption selected={false} onSelect={snap}>Snap to the nearest axis</CustomDropdownOption>
              </CustomDropdownSection>
            </CustomDropdown>
            <Button sdsType="primary" sdsStyle="rounded" onClick={handleShareClick}>Share</Button>
            <CustomDropdown className='w-11 h-11 p-3' buttonElement={<InfoIcon className="w-5 h-5" />}>
              <CustomDropdownSection title="About">
                {ABOUT_LINKS.map((option) => (
                  <MenuItemLink key={option.label} to={option.link}>
                    {t(option.label)}
                  </MenuItemLink>
                ))}
              </CustomDropdownSection>
              <CustomDropdownSection title="Report">
                {REPORT_LINKS.map((option) => (
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
        <NeuroglancerWrapper onStateChange={refresh} />
      </div>
      <Snackbar open={shareClicked} intent="positive" title='Share link copied to clipboard' className='max-h-8 !max-w-[265px]'/>
    </div>
  )
}

export default ViewerPage
