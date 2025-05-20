import './ViewerPage.css'

import { CryoETHomeLink } from '../Layout/CryoETHomeLink'
import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { Button } from '@czi-sds/components'
import {
  currentNeuroglancer,
  currentNeuroglancerState,
  currentState,
  encodeState,
  NeuroglancerLayout,
  NeuroglancerWrapper,
  ResolvedSuperState,
  updateState,
} from 'neuroglancer'
import { useEffect, useRef, useState } from 'react'

import { InfoIcon } from 'app/components/icons'
import { MenuItemLink } from 'app/components/MenuItemLink'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import {
  CustomDropdown,
  CustomDropdownOption,
  CustomDropdownSection,
} from '../common/CustomDropdown'
import Snackbar from '../common/Snackbar'
import {
  ABOUT_LINKS,
  REPORT_LINKS,
  NEUROGLANCER_DOC_LINK,
} from '../Layout/constants'
import { ACTIONS } from 'react-joyride'
import Tour from './Tour'
import { getTutorialSteps } from './steps'

const WALKTHROUGH_PANEL_SIZE = 400

const boolValue = (
  value: boolean | undefined,
  defaultValue: boolean = true,
): boolean => {
  return value === undefined ? defaultValue : value
}

const panelsDefaultValues = {
  helpPanel: false,
  settingsPanel: false,
  selectedLayer: false,
  layerListPanel: false,
  selection: true,
}
type PanelName = keyof typeof panelsDefaultValues

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

const showSectionsEnabled = () => {
  return currentNeuroglancer()?.showPerspectiveSliceViews.value
}

const toggleShowSections = () => {
  const viewer = currentNeuroglancer()
  viewer.showPerspectiveSliceViews.value =
    !viewer.showPerspectiveSliceViews.value
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
  viewer.perspectiveNavigationState.pose.orientation.snap()
}

const togglePanels = () => {
  updateState((state) => {
    if (state.savedPanelsStatus) {
      // Restore the configuration
      for (const panelName of state.savedPanelsStatus as PanelName[]) {
        if (!(panelName in state.neuroglancer)) {
          state.neuroglancer[panelName] = {
            visible: !panelsDefaultValues[panelName],
          }
        } else {
          state.neuroglancer[panelName].visible = !boolValue(
            state.neuroglancer[panelName].visible,
            panelsDefaultValues[panelName],
          )
        }
      }
      delete state.savedPanelsStatus
      return state
    }
    const currentPanelConfig: string[] = []
    for (const [panelName, defaultValue] of Object.entries(
      panelsDefaultValues,
    )) {
      const isVisible = boolValue(
        state.neuroglancer[panelName]?.visible,
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
  const isVisible = isTopBarVisible()
  updateState((state) => {
    state.showLayerTopBar = !isVisible
    return state
  })
  const viewer = currentNeuroglancer()
  viewer.uiConfiguration.showLayerPanel.value = !isVisible
}

const isTopBarVisible = () => {
  const state = currentState()
  return boolValue(state.showLayerTopBar, /* defaultValue = */ false)
}

const setTopBarVisibleFromSuperState = () => {
  const viewer = currentNeuroglancer()
  viewer.uiConfiguration.showLayerPanel.value = isTopBarVisible()
}

const buildDepositsConfig = (annotations: any) => {
  const config: any = {}
  const layers = currentNeuroglancerState().layers || []
  for (const annotation of annotations.edges.map((e: any) => e.node)) {
    const { depositionId } = annotation
    const httpsPath = annotation.httpsMetadataPath
      .replace('.json', '')
      .split('/')
      .slice(-2)
      .join('-')
    const layer = layers.find(
      (l) =>
        l.source.includes?.(httpsPath) || l.source.url?.includes(httpsPath),
    )
    if (!(depositionId in config)) {
      config[depositionId] = [{ name: layer?.name, annotation }]
    } else {
      config[depositionId].push({ name: layer?.name, annotation })
    }
  }
  return config
}

const isDepositionActivated = (depositionEntries: string[]) => {
  const layers = currentNeuroglancerState().layers || []
  return layers
    .filter((l) => l.name && depositionEntries.includes(l.name))
    .some(
      (l) =>
        !boolValue(l.archived, /* defaultValue = */ false) &&
        boolValue(l.visible, /* defaultValue = */ true),
    )
}

const toggleDepositions = (depositionEntries: string[]) => {
  const isCurrentlyActive = isDepositionActivated(depositionEntries)
  updateState((state) => {
    const layers = state.neuroglancer?.layers || []
    for (const layer of layers.filter(
      (l) => l.name && depositionEntries.includes(l.name),
    )) {
      layer.archived = isCurrentlyActive
      layer.visible = !isCurrentlyActive
    }
    return state
  })
}

const toggleAllDepositions = () => {
  updateState((state) => {
    const layers = state.neuroglancer?.layers || []
    const layersOfInterest = layers.filter((l) => l.type !== 'image')
    const archived = layersOfInterest.some(
      (l) =>
        boolValue(l.archived, /* defaultValue = */ false) &&
        boolValue(l.visible, /* defaultValue = */ true),
    )
    for (const layer of layersOfInterest) {
      layer.archived = !archived
      layer.visible = archived
    }
    return state
  })
}

const isAllLayerActive = () => {
  const layers = currentNeuroglancerState().layers || []
  const layersOfInterest = layers.filter((l) => l.type !== 'image')
  return layersOfInterest.every(
    (l) =>
      !boolValue(l.archived, /* defaultValue = */ false) &&
      boolValue(l.visible, /* defaultValue = */ true),
  )
}

function ViewerPage({ run, tomogram }: { run: any; tomogram: any }) {
  const { t } = useI18n()
  const [renderVersion, setRenderVersion] = useState(0)
  const [tourRunning, setTourRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState<number>(0)
  const [shareClicked, setShareClicked] = useState<boolean>(false)
  const [snapActionClicked, setSnapActionClicked] = useState<boolean>(false)
  const iframeRef = useRef<HTMLIFrameElement>()

  const depositionConfigs = buildDepositsConfig(run.annotations)

  const scheduleRefresh = () => {
    setRenderVersion(renderVersion + 1)
  }

  const adjustPanelSize = (stringState: string) => {
    const state = JSON.parse(stringState)
    if (state.layerListPanel) {
      state.layerListPanel.size = WALKTHROUGH_PANEL_SIZE
      state.selectedLayer.size = WALKTHROUGH_PANEL_SIZE
    }
    return encodeState(state, /* compress = */ false)
  }

  const handleTourStartInNewTab = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    localStorage.setItem('startTutorial', 'true')
    const { protocol, host, pathname, search } = window.location
    const newEncodedState = adjustPanelSize(tomogram.neuroglancerConfig)
    const urlWithoutHash = `${protocol}//${host}${pathname}${search}${newEncodedState}`
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

  const handleOnStateChange = (state: ResolvedSuperState) => {
    scheduleRefresh()
    setTopBarVisibleFromSuperState()
    if (!state.savedPanelsStatus) {
      return
    }
    updateState((state) => {
      const savedPanels = state.savedPanelsStatus
      for (const panelName of savedPanels as PanelName[]) {
        const visible = boolValue(
          state.neuroglancer[panelName]?.visible,
          panelsDefaultValues[panelName],
        )
        if (visible && savedPanels.includes(panelName)) {
          delete state.savedPanelsStatus
          return state
        }
      }
      return undefined
    })
  }

  useEffect(() => {
    const shouldStartTutorial = localStorage.getItem('startTutorial') === 'true'

    if (shouldStartTutorial) {
      setTourRunning(true)

      localStorage.removeItem('startTutorial')
    }

    const keyDownHandler = (event: KeyboardEvent) => {
      const iframe = iframeRef.current
      const iframeWindow = iframe?.contentWindow

      if (!iframeWindow) {
        return
      }

      const targetElement = (iframeWindow as any).neuroglancer?.element
      if (!targetElement) {
        return
      }

      const simulatedEvent = new KeyboardEvent('keydown', {
        key: event.key,
        code: event.code,
        keyCode: event.keyCode,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        bubbles: true,
      })

      targetElement.dispatchEvent(simulatedEvent)
    }

    window.addEventListener('keydown', keyDownHandler)
    return () => {
      window.removeEventListener('keydown', keyDownHandler)
    }
  }, [])

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setShareClicked(true)
      })
      .catch((err) => {
        console.error('Failed to copy URL: ', err)
      })
  }

  const handleSnapActionClick = () => {
    snap()
    setSnapActionClicked(true)
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
                  selected={isAllLayerActive()}
                  onSelect={() => toggleAllDepositions()}
                >
                  All annotations
                </CustomDropdownOption>
                {Object.keys(depositionConfigs).map((depositionId, i) => {
                  const layersOfInterest = depositionConfigs[depositionId].map(
                    (c: any) => c.name,
                  )
                  return (
                    <CustomDropdownOption
                      key={depositionId.toString()}
                      selected={isDepositionActivated(layersOfInterest)}
                      onSelect={() => {
                        toggleDepositions(layersOfInterest)
                      }}
                    >
                      <span>Deposition #{i + 1}</span>
                      <span className="text-xs text-[#767676] font-normal">
                        #CZCDP-{depositionId}
                      </span>
                    </CustomDropdownOption>
                  )
                })}
              </CustomDropdownSection>
            </CustomDropdown>
            <CustomDropdown title="Layout" variant="outlined">
              <CustomDropdownSection title="Layout">
                <CustomDropdownOption
                  selected={
                    isCurrentLayout('4panel') || isCurrentLayout('4panel-alt')
                  }
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
                <CustomDropdownOption
                  selected={currentState().savedPanelsStatus !== undefined}
                  onSelect={togglePanels}
                >
                  Hide UI
                </CustomDropdownOption>
                <CustomDropdownOption
                  selected={isTopBarVisible()}
                  onSelect={toggleTopBar}
                >
                  Show top layer bar
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
                <CustomDropdownOption
                  selected={showSectionsEnabled()}
                  onSelect={toggleShowSections}
                >
                  <div className="flex justify-between items-center">
                    <p>Cross-sections</p>
                    <p className={helperText}>s</p>
                  </div>
                </CustomDropdownOption>
              </CustomDropdownSection>
              <CustomDropdownSection title="Move">
                <CustomDropdownOption
                  selected={false}
                  onSelect={handleSnapActionClick}
                >
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
      <div className="iframeContainer">
        <NeuroglancerWrapper
          onStateChange={handleOnStateChange}
          ref={iframeRef}
        />
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
        message="Share link copied to clipboard"
        handleClose={() => setShareClicked(false)}
      />
      <Snackbar
        open={snapActionClicked}
        intent="positive"
        message="Snapped to the nearest axis"
        handleClose={() => setSnapActionClicked(false)}
      />
    </div>
  )
}

export default ViewerPage
