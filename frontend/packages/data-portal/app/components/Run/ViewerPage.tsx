import './ViewerPage.css'

import {
  currentNeuroglancerState,
  NeuroglancerWrapper,
  currentNeuroglancer,
  updateState,
  NeuroglancerLayout,
} from 'neuroglancer'
import { useState, useEffect } from 'react'
import { cns } from 'app/utils/cns'
import { CryoETHomeLink } from '../Layout/CryoETHomeLink'
import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { Button } from '@czi-sds/components'
import { InfoIcon } from 'app/components/icons'
import { MenuItemLink } from 'app/components/MenuItemLink'
import {
  CustomDropdown,
  CustomDropdownSection,
  CustomDropdownOption,
} from '../common/CustomDropdown'
import {
  ABOUT_LINKS,
  REPORT_LINKS,
  NEUROGLANCER_DOC_LINK,
} from '../Layout/constants'
import { ACTIONS } from 'react-joyride'
import Tour from './Tour'
import { getTutorialSteps } from './steps'
import { useI18n } from 'app/hooks/useI18n'
import Snackbar from '../common/Snackbar'

// Button action for toggling layers visibility
const isAnnotation = (layer: any) =>
  layer.type === 'annotation' || layer.type === 'segmentation'
const toggleVisibility = (layer: any) =>
  !(layer.visible === undefined || layer.visible)

const boolValue = (
  value: boolean | undefined,
  defaultValue: boolean = true,
): boolean => {
  return value === undefined ? defaultValue : value
}

const toggleAnnotations = () => {
  updateState((state) => {
    if (!state.neuroglancer.layers) {
      return state
    }
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
    if (!state.neuroglancer.layers) {
      return state
    }
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
  const viewer = currentNeuroglancer()
  viewer.showDefaultAnnotations.value = !viewer.showDefaultAnnotations.value
}

const hasBoundingBox = () => {
  return currentNeuroglancer()?.showDefaultAnnotations.value
}

const toggleAxisLine = () => {
  const viewer = currentNeuroglancer()
  viewer.showAxisLines.value = !viewer.showAxisLines.value
}

const axisLineEnabled = () => {
  return currentNeuroglancer()?.showAxisLines.value
}

const showScaleBarEnabled = () => {
  return currentNeuroglancer()?.showScaleBar.value
}

const toggleShowScaleBar = () => {
  const viewer = currentNeuroglancer()
  viewer.showScaleBar.value = !viewer.showScaleBar.value
}

const currentLayout = () => {
  return currentNeuroglancerState().layout
}

const isCurrentLayout = (layout: string) => {
  return currentLayout() === layout
}

const setCurrentLayout = (layout: string) => {
  updateState((state) => {
    state.neuroglancer.layout = layout as NeuroglancerLayout
    return state
  })
}

const snap = () => {
  const viewer = currentNeuroglancer()
  viewer.navigationState.pose.orientation.snap()
}

const togglePanels = () => {
  const panelsDefaultValues = {
    helpPanel: false,
    settingsPanel: false,
    selectedLayer: false,
    layerListPanel: false,
    selection: true,
  }
  type PanelName = keyof typeof panelsDefaultValues
  updateState((state) => {
    if (state.savedPanelsStatus) {
      for (const panelName of state.savedPanelsStatus as PanelName[]) {
        state.neuroglancer[panelName].visible = !boolValue(
          state.neuroglancer[panelName].visible,
          panelsDefaultValues[panelName],
        )
        delete state.savedPanelsStatus
      }
      return state
    }
    const currentPanelConfig: string[] = []
    for (const [panelName, defaultValue] of Object.entries(
      panelsDefaultValues,
    )) {
      const isVisible = boolValue(
        state.neuroglancer[panelName].visible,
        defaultValue,
      )
      if (isVisible) {
        currentPanelConfig.push(panelName)
        state.neuroglancer[panelName].visible = !isVisible
      }
    }
    state.savedPanelsStatus = currentPanelConfig
    return state
  })
}

const toggleTopBar = () => {
  const viewer = currentNeuroglancer()
  viewer.uiConfiguration.showLayerPanel.value = !isTopBarVisible()
}

const isTopBarVisible = () => {
  const viewer = currentNeuroglancer()
  return viewer?.uiConfiguration?.showLayerPanel.value ?? false
}

function ViewerPage({ run, tomogram }: { run: any; tomogram: any }) {
  const { t } = useI18n()
  const [renderVersion, setRenderVersion] = useState(0)
  const [tourRunning, setTourRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [shareClicked, setShareClicked] = useState<boolean>(false)

  const refresh = () => {
    setRenderVersion(renderVersion + 1)
  }

  const handleTourStartInNewTab = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    localStorage.setItem('startTutorial', 'true')
    const { protocol, host, pathname, search } = window.location
    const urlWithoutHash = `${protocol}//${host}${pathname}${search}#!${encodeURIComponent(tomogram.neuroglancerConfig)}`
    // window.open(window.location.href, '_blank')
    window.open(urlWithoutHash, '_blank')
  }

  const handleTourClose = () => {
    setTourRunning(false)
    setTimeout(() => {
      setStepIndex(0)
    }, 300)
  }

  const handleTourStepMove = (
    index: number,
    action: (typeof ACTIONS)[keyof typeof ACTIONS],
  ) => {
    setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
  }

  const handleRestart = () => {
    setTourRunning(false)
    setTimeout(() => {
      setStepIndex(0)
      setTourRunning(true)
    }, 300)
  }

  useEffect(() => {
    const shouldStartTutorial = localStorage.getItem('startTutorial') === 'true'

    if (shouldStartTutorial) {
      setTourRunning(true)

      localStorage.removeItem('startTutorial')
    }
  }, [])

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setShareClicked(true)
        setTimeout(() => {
          setShareClicked(false)
        }, 3000)
      })
      .catch((err) => {
        console.error('Failed to copy URL: ', err)
      })
  }

  const helperText = 'text-xs text-[#767676] font-normal'
  const activeBreadcrumbText = (
    <p>
      {run.name}{' '}
      <span className="text-sds-color-primitive-common-white opacity-60">
        (#RN-{run.id})
      </span>
    </p>
  )

  return (
    <div className="flex flex-col overflow-hidden h-full relative">
      <nav
        className={cns(
          'bg-sds-color-primitive-common-black text-sds-color-primitive-common-white',
          'flex flex-shrink-0 items-center py-1',
          'sticky top-0 z-30 max-h-12',
        )}
      >
        <div className="flex items-center gap-4">
          <CryoETHomeLink textSize="text-sm" />
          <Breadcrumbs
            variant="neuroglancer"
            data={run.dataset}
            type="light"
            activeBreadcrumbText={activeBreadcrumbText}
          />
        </div>
        {/* Add empty space to push content to right */}
        <div className="basis-sds-xxl flex-grow screen-790:mr-sds-xxl" />
        <div className="hidden screen-716:flex basis-auto flex-shrink-0">
          <div className="flex items-center gap-1">
            <CustomDropdown title="Annotations" variant="outlined">
              <CustomDropdownSection title="Toggle annotations per deposition">
                <CustomDropdownOption
                  selected={false}
                  onSelect={() => toggleAnnotations()}
                >
                  All annotations
                </CustomDropdownOption>
                {currentNeuroglancerState()
                  .layers?.filter((layer: any) => layer.type === 'annotation')
                  .map((annotation: any) => (
                    <CustomDropdownOption
                      key={annotation.name}
                      selected={
                        !boolValue(
                          annotation.archived,
                          /* defaultValue =*/ false,
                        )
                      }
                      onSelect={() => toggleLayer(annotation.name)}
                    >
                      <span>{annotation?.name}</span>
                      <span className="text-xs text-[#767676] font-normal">
                        #CZCDP-12795
                      </span>
                    </CustomDropdownOption>
                  ))}
              </CustomDropdownSection>
            </CustomDropdown>
            <CustomDropdown title="Layout" variant="outlined">
              <CustomDropdownSection title="Layout">
                <CustomDropdownOption
                  selected={isCurrentLayout('4panel')}
                  onSelect={() => setCurrentLayout('4panel')}
                >
                  4 panel
                </CustomDropdownOption>
                <CustomDropdownOption
                  selected={isCurrentLayout('xy')}
                  onSelect={() => setCurrentLayout('xy')}
                >
                  XY
                </CustomDropdownOption>
                <CustomDropdownOption
                  selected={isCurrentLayout('xz')}
                  onSelect={() => setCurrentLayout('xz')}
                >
                  XZ
                </CustomDropdownOption>
                <CustomDropdownOption
                  selected={isCurrentLayout('yz')}
                  onSelect={() => setCurrentLayout('yz')}
                >
                  YZ
                </CustomDropdownOption>
                <CustomDropdownOption
                  selected={isCurrentLayout('3d')}
                  onSelect={() => setCurrentLayout('3d')}
                >
                  3D
                </CustomDropdownOption>
              </CustomDropdownSection>
              <CustomDropdownSection title="Toggle Panels">
                <CustomDropdownOption selected={false} onSelect={togglePanels}>
                  All panels
                </CustomDropdownOption>
                <CustomDropdownOption
                  selected={isTopBarVisible()}
                  onSelect={() => {
                    toggleTopBar()
                    refresh()
                  }}
                >
                  Top layer bar
                </CustomDropdownOption>
              </CustomDropdownSection>
            </CustomDropdown>
            <CustomDropdown title="Actions" variant="outlined">
              <CustomDropdownSection title="Appearance">
                <CustomDropdownOption
                  selected={hasBoundingBox()}
                  onSelect={toggleBoundingBox}
                >
                  <div className="flex justify-between items-center">
                    <p>Bounding box</p>
                    <p className={helperText}>v</p>
                  </div>
                </CustomDropdownOption>
                <CustomDropdownOption
                  selected={axisLineEnabled()}
                  onSelect={toggleAxisLine}
                >
                  <div className="flex justify-between items-center">
                    <p>Axis lines</p>
                    <p className={helperText}>a</p>
                  </div>
                </CustomDropdownOption>
                <CustomDropdownOption
                  selected={showScaleBarEnabled()}
                  onSelect={toggleShowScaleBar}
                >
                  <div className="flex justify-between items-center">
                    <p>Scale bar</p>
                    <p className={helperText}>b</p>
                  </div>
                </CustomDropdownOption>
              </CustomDropdownSection>
              <CustomDropdownSection title="Move">
                <CustomDropdownOption selected={false} onSelect={snap}>
                  <div className="flex justify-between items-center">
                    <p>Snap to nearest axis</p>
                    <p className={helperText}>z</p>
                  </div>
                </CustomDropdownOption>
              </CustomDropdownSection>
            </CustomDropdown>
            <Button
              sdsType="primary"
              sdsStyle="rounded"
              disabled={shareClicked}
              onClick={handleShareClick}
            >
              Share
            </Button>
            <CustomDropdown
              className="w-11 h-11 p-3"
              buttonElement={<InfoIcon className="w-5 h-5" />}
            >
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
                <button
                  type="button"
                  className="py-1.5 px-2"
                  onClick={handleTourStartInNewTab}
                >
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
      {run && (
        <Tour
          run={tourRunning}
          stepIndex={stepIndex}
          steps={getTutorialSteps()}
          onRestart={handleRestart}
          onClose={handleTourClose}
          onMove={handleTourStepMove}
        />
      )}
      <Snackbar
        open={shareClicked}
        intent="positive"
        title="Share link copied to clipboard"
        className="max-h-8 !max-w-[265px]"
      />
    </div>
  )
}

export default ViewerPage
