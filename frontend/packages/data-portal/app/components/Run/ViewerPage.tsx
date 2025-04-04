import './ViewerPage.css'

import { currentNeuroglancerState, NeuroglancerWrapper, ResolvedSuperState, updateState } from 'neuroglancer'
import { useState, useEffect } from 'react'
import { cns } from 'app/utils/cns'
import { CryoETHomeLink } from '../Layout/CryoETHomeLink'
import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { Button } from '@czi-sds/components'
import { InfoIcon } from 'app/components/icons'
import { MenuItemLink } from "app/components/MenuItemLink";
import { CustomDropdown, CustomDropdownSection, CustomDropdownOption } from '../common/CustomDropdown'
import { ACTIONS } from 'react-joyride'
import Tour from './Tour'
import { getTutorialSteps } from './steps';
import { ABOUT_LINKS, REPORT_LINKS, NEUROGLANCER_DOC_LINK  } from '../Layout/constants'
import { useI18n } from 'app/hooks/useI18n'

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


function ViewerPage({ run } : { run: any }) {
  const { t } = useI18n()
  const [renderVersion, setRenderVersion] = useState(0)
  const [annotations, setAnnotations] = useState<any>([])
  const [tourRunning, setTourRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const refresh = () => {
    setRenderVersion(renderVersion + 1)
  }

  const handleTourStart = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    localStorage.setItem("startTutorial", "true")
    window.open("http://localhost:8080/view/runs/16463/#!H4sIAAAAAAAAA-1YTZObNhj-LT34aEYIMHCs7XEuabuT7WyPHhlkW12BGEk46_31fRFfEsZJNpNMDl3vDhi9318PkhfxeoFxSWspTpyUGZXwuAh-b644-G2Bo4YhwjhnBS0VE6Uyj4alp71YS9Ha9xDyMV2mzerGkIqWAajbcfH6XVKvb5OKLdFKKKYhAkdD4EeGo7-nU4OZFEo90qyRfMwIp72470VxZGmX4t-W6y_JaKnJjSnkBQleJUGIV37ox0HSeo3sq5fiIInTCIUYBXG6CifejFYcX1ZpMPJwcqVSOabHWulrRS0SxqwgJ9rnrNOgRC0zl-2VSGm-7-D_rHWlhqcj41R5mbwKqnOiSSWkJtzLXpnKIBMZ9TIBVdn5KAwhzN3fj_toD4HtPtEM-knL2gQEHu-exAvljxXJWHnykQe1bfhFIU6SFMroGDV4xifXc00Ojtt2JAOTaAzoof_8kXLgtMwdBSTPoWkuUxWZyOkTU-ww1uBIuKJWDs8kp9LRBRNVMwhZS8GbBcTKC6eyMt_NOlG6qdemvGE9iFGGSr232EH2TLPng3jpZZvrkQvSUk_UZU-ai-k91PdFK2WeMRolL4TXtCUE27vWF8HO3GEYzX05jcex2OZinhzc-CKprmXpOGMxmekeIr4IZmqHCsLKtwUqal3V-unWQsfp0sd03E3trQpaMP1Bkqvq5zaZKE1nYnOG0jTUpu2JGRS2_XApkpQne5qj9RJmCz4Y-yjBKEl8FOAARR0GtaQI-_AXp8lqFflhPAGiz6zMxec5pQEoC1Ea-AGIo1VqKQ38MIxRGsN6uALVCxulbai-CF4X9BMMI5UABR-6gjamlrGXjIwlKVyc6sGlTd2o8x78kbIUNlZ_CQMrCYBVQM1o_oug8E_rRf0weNPi4vJIpQSsKvfNMqcvS-yhfSVYqb8CkrLP84RvzM1GcHGDZWGOMj_9KcA4Tqbxf3jXIcVZJ5wU0BPBtsnMoBsm_wXWcAtE7ZLStLL40sU8vlpYML4dZs1NrfnfYu278Ikdh--J7VWDPh0Adf60SnLoMiLzWfhRVA9FTC40MyOS5PRIam5RBmWbaS7S-9AGuh-aMv1B5DOVj-y1xbdJ6ZpLi_2wian2OYPR1XRi9lsMrIWEovzDcn02wsjz3yY6kwinrvcfvpKPN2O2m6LJZmRmm2Jj5A30mb1R08odDpiHDgvGWeo9_B9Bo788UE32pLhyoujPhkWEjse2Eu-w-A6L77D462HRCKM1YMCyw4A7cGhvcM_Q4hvr7L8m2fNJirrMg22vH0DJnmDKgZXmH5vz921QChQ6jnF6nELQsYPqhgd5kbXRVV37NJQQj7nHFxdVXJf4xJX7-2P3h44x2DsQ13wmvoMtONE4rGFFSsonfGfKq4dx_Yspkux0nuZIjscONAkBuhreeyf1g9RPW6stsPuzTn_EGqUsXZd5xLd1mgp9ZErf8Xnizkyf-F5oj9bb-mQ4eeFFvP0PS_e8OA0UAAA", "_blank")
  }

  const handleTourClose = () => {
    setTourRunning(false)
    setTimeout(() => {
      setStepIndex(0)
    }, 300)
  }

  const handleTourStepMove = (index: number, action: (typeof ACTIONS)[keyof typeof ACTIONS]) => {
    setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1)); 
  }

  const handleRestart = () => {
    setTourRunning(false)
    setTimeout(() => {
      setStepIndex(0)
      setTourRunning(true)
    }, 300)
  };

  useEffect(() => {
    const shouldStartTutorial = localStorage.getItem("startTutorial") === "true"

    if (shouldStartTutorial) {
      setTourRunning(true)

      localStorage.removeItem("startTutorial")
    }
  }, [])

  const activeBreadcrumbText = (
    <p>
      {run.name} <span className='text-sds-color-primitive-common-white opacity-60'>(#RN-{run.id})</span>
    </p>
  );


  return (
    <div className="flex flex-col overflow-hidden h-full">
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
                <CustomDropdownOption disabled selected={false} onSelect={() => console.log("Snap to the nearest axis")}>Snap to the nearest axis</CustomDropdownOption>
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
              <CustomDropdownSection title="Report">
                {REPORT_LINKS.map((option) => (
                  <MenuItemLink key={option.label} to={option.link}>
                    {t(option.label)}
                  </MenuItemLink>
                ))}
              </CustomDropdownSection>
              <CustomDropdownSection title="Neuroglancer help">
                <MenuItemLink to={NEUROGLANCER_DOC_LINK}>
                  {t('goToNeuroglancerDocumentation')}
                </MenuItemLink>
                <button type="button" className="py-1.5 px-2" onClick={handleTourStart}>
                  {t('neuroglancerWalkthrough')}
                </button>
              </CustomDropdownSection>
            </CustomDropdown>
          </div>
        </div>
      </nav>
      <div className="iframe-container">
        <NeuroglancerWrapper onStateChange={refresh} />
      </div>
      {run && <Tour run={tourRunning} stepIndex={stepIndex} steps={getTutorialSteps()} onRestart={handleRestart} onClose={handleTourClose} onMove={handleTourStepMove}/>}
    </div>
  )
}

export default ViewerPage
