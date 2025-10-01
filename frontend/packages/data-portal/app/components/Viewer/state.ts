/**
 * Neuroglancer Viewer Page State Management
 */
import {
  currentNeuroglancer,
  currentNeuroglancerState,
  currentState,
  DimensionValue,
  getLayerSourceUrl,
  NeuroglancerLayout,
  NeuroglancerState,
  ResolvedSuperState,
  updateState,
} from 'neuroglancer'

const TOUR_PANEL_SIZE = 375
const MINUMUM_TOUR_PANEL_SIZE = 360

// The viewer page super state extends the resolved super state
// with additional properties specific to the viewer page.
export interface ViewerPageSuperState extends ResolvedSuperState {
  showLayerTopBar?: boolean // Whether the top layer bar is visible
  restoreLayerTopBar?: boolean // Whether to restore the top layer bar
  dimensionSlider?: boolean // Whether the dimension slider is visible
  savedPanelsStatus?: PanelName[] // List of panels that are currently visible
  tourStepIndex?: number // The current step index in the tour
}

export function getCurrentState(): ViewerPageSuperState {
  return currentState() as ViewerPageSuperState
}

// Neuroglancer states only store values if different from the default.
// So if the value is undefined, that means we assume default value.
export function resolveStateBool(
  value: boolean | undefined,
  defaultValue: boolean = true,
): boolean {
  return value === undefined ? defaultValue : value
}

export const panelsDefaultValues = {
  helpPanel: false,
  settingsPanel: false,
  selectedLayer: false,
  layerListPanel: false,
  selection: true,
}
export type PanelName = keyof typeof panelsDefaultValues

export function toggleBoundingBox() {
  const viewer = currentNeuroglancer()
  if (!viewer) return
  viewer.showDefaultAnnotations.value = !viewer.showDefaultAnnotations.value
}

export function hasBoundingBox() {
  return currentNeuroglancer()?.showDefaultAnnotations.value
}

export function toggleAxisLine() {
  const viewer = currentNeuroglancer()
  if (!viewer) return
  viewer.showAxisLines.value = !viewer.showAxisLines.value
}

export function axisLineEnabled() {
  return currentNeuroglancer()?.showAxisLines.value
}

export function showScaleBarEnabled() {
  return currentNeuroglancer()?.showScaleBar.value
}

export function toggleShowScaleBar() {
  const viewer = currentNeuroglancer()
  if (!viewer) return
  viewer.showScaleBar.value = !viewer.showScaleBar.value
}

export function showSectionsEnabled() {
  return currentNeuroglancer()?.showPerspectiveSliceViews.value
}

export function toggleShowSections() {
  const viewer = currentNeuroglancer()
  if (!viewer) return
  viewer.showPerspectiveSliceViews.value =
    !viewer.showPerspectiveSliceViews.value
}

export function currentLayout() {
  return currentNeuroglancerState().layout
}

export function isCurrentLayout(layout: NeuroglancerLayout) {
  return currentLayout() === layout
}

export function isBigEnoughForTour() {
  const state = getCurrentState()
  const panelSize = state.neuroglancer?.selectedLayer?.size
  return panelSize !== undefined && panelSize >= MINUMUM_TOUR_PANEL_SIZE
}

export function setCurrentLayout(
  layout: NeuroglancerLayout,
  commit: boolean = true,
) {
  const stateModifier = (state: ResolvedSuperState) => {
    const newState = state
    // @ts-expect-error: The neuroglancer state is not typed with NeuroglancerLayout
    newState.neuroglancer.layout = layout
    return newState
  }
  if (commit) {
    updateState(stateModifier)
  }
  return stateModifier
}

export function snap() {
  const viewer = currentNeuroglancer()
  if (!viewer) return
  viewer.navigationState.pose.orientation.snap()
  viewer.perspectiveNavigationState.pose.orientation.snap()
}

export function togglePanels(
  show: boolean | undefined = undefined,
  commit = true,
) {
  const stateModifier = (state: ViewerPageSuperState) => {
    let newState = state
    if (state.savedPanelsStatus && (show === undefined || show === true)) {
      // Restore the configuration
      for (const panelName of state.savedPanelsStatus) {
        if (!(panelName in state.neuroglancer)) {
          newState.neuroglancer[panelName] = {
            visible: !panelsDefaultValues[panelName],
          }
        } else {
          newState.neuroglancer[panelName]!.visible = !resolveStateBool(
            state.neuroglancer[panelName]?.visible,
            panelsDefaultValues[panelName],
          )
        }
      }
      if (state.dimensionSlider && !isDimensionPanelVisible()) {
        newState = toggleDimensionPanelVisible(newState)
      }
      if (state.restoreLayerTopBar && !isTopBarVisible()) {
        newState = toggleTopBar(true, false)(newState)
      }
      delete newState.savedPanelsStatus
      delete newState.dimensionSlider
      delete newState.restoreLayerTopBar
      return newState
    }
    const currentPanelConfig: PanelName[] = []
    for (const [name, defaultValue] of Object.entries(panelsDefaultValues)) {
      const panelName = name as PanelName
      const panelState = state.neuroglancer[panelName]
      const isVisible = resolveStateBool(panelState?.visible, defaultValue)
      if (isVisible) {
        if (show !== undefined) {
          if (show === false) {
            currentPanelConfig.push(panelName)
          }
          newState.neuroglancer[panelName]!.visible = show
        } else {
          currentPanelConfig.push(panelName)
          newState.neuroglancer[panelName]!.visible = !isVisible
        }
      }
    }
    newState.dimensionSlider = isDimensionPanelVisible()
    if (newState.dimensionSlider) {
      newState = toggleDimensionPanelVisible(newState, show)
    }
    newState.restoreLayerTopBar = isTopBarVisible()
    if (newState.restoreLayerTopBar) {
      newState = toggleTopBar(show, false)(newState)
    }
    newState.savedPanelsStatus = currentPanelConfig
    return newState
  }

  if (commit) {
    updateState(stateModifier)
  }

  return stateModifier
}

export function toggleTopBar(
  show: boolean | undefined = undefined,
  commit = true,
) {
  const stateModifier = (state: ResolvedSuperState) => {
    const newState = state
    newState.showLayerTopBar = show !== undefined ? show : !isVisible
    return newState
  }

  const isVisible = isTopBarVisible()

  if (commit) {
    updateState(stateModifier)
  }

  const viewer = currentNeuroglancer()
  if (viewer) {
    viewer.uiConfiguration.showLayerPanel.value = !isVisible
  }

  return stateModifier
}

export function chainStateModifiers(
  modifiers: ((state: ResolvedSuperState) => ResolvedSuperState)[],
): (state: ResolvedSuperState) => ResolvedSuperState | undefined {
  return (state: ResolvedSuperState) => {
    let finalState = state
    for (const modifier of modifiers) {
      finalState = modifier(finalState)
    }
    return finalState
  }
}

export function isTopBarVisible() {
  const state = getCurrentState()
  return resolveStateBool(state.showLayerTopBar, /* defaultValue = */ false)
}

export function setTopBarVisibleFromSuperState() {
  const viewer = currentNeuroglancer()
  if (!viewer) return
  viewer.uiConfiguration.showLayerPanel.value = isTopBarVisible()
}

export function isDimensionPanelVisible() {
  const state = currentState()
  const toolPalettes = state.neuroglancer?.toolPalettes || {}
  if (Object.keys(toolPalettes).length === 0) {
    // If there are no tool palettes, the dimension slider is not visible
    return false
  }
  const tool = Object.values(toolPalettes)[0]
  return resolveStateBool(tool?.visible, /* defaultValue = */ true)
}

export function makeDimensionPanel(state: ResolvedSuperState) {
  const newState = state
  newState.neuroglancer.toolPalettes = {
    Position: {
      side: 'bottom',
      row: 1,
      size: 100,
      visible: true,
      query: 'type:dimension',
      verticalStacking: false,
    },
  }
  return newState
}

export function setupTourPanelState() {
  updateState((state) => {
    const newState = state
    newState.neuroglancer.layerListPanel = {
      row: 1,
      size: TOUR_PANEL_SIZE,
      visible: true,
      side: 'left',
    }
    const currentLayer = newState.neuroglancer.selectedLayer?.layer ?? undefined
    newState.neuroglancer.selectedLayer = {
      size: TOUR_PANEL_SIZE,
      visible: true,
      side: 'left',
      layer: currentLayer,
    }
    return state
  })
}

export function toggleDimensionPanelVisible(
  state: ResolvedSuperState,
  show?: boolean,
) {
  if (state.neuroglancer.toolPalettes === undefined) return state
  const toolPalette = Object.values(state.neuroglancer.toolPalettes)[0]
  if (toolPalette === undefined) return state
  toolPalette.visible = show !== undefined ? show : !isDimensionPanelVisible()
  return state
}

export function toggleOrMakeDimensionPanel() {
  const hasToolPalette =
    Object.keys(currentState().neuroglancer?.toolPalettes || {}).length > 0
  if (!hasToolPalette) updateState(makeDimensionPanel)
  else updateState(toggleDimensionPanelVisible)
}

export function isTomogramActivatedFromConfig(
  tomogramConfig: string | undefined | null,
) {
  if (!tomogramConfig) return false
  const layers = currentNeuroglancerState().layers || []
  const jsonConfig = JSON.parse(tomogramConfig) as NeuroglancerState
  const newLayers = jsonConfig.layers || []
  const tomogramLayer = newLayers.find((l) => l.type === 'image')
  if (!tomogramLayer) return false
  return layers.some(
    (l) =>
      l.type === 'image' &&
      getLayerSourceUrl(l) === getLayerSourceUrl(tomogramLayer),
  )
}

export function isTomogramActivated(tomogramPath: string | undefined | null) {
  if (!tomogramPath) return false
  const layers = currentNeuroglancerState().layers || []
  return layers.some(
    (l) => l.type === 'image' && getLayerSourceUrl(l) === tomogramPath,
  )
}

function inferVoxelSpacingFromState(state: NeuroglancerState) {
  const { dimensions } = state
  if (dimensions === undefined) {
    throw new Error('Cannot infer voxel spacing without dimensions')
  }
  // Get the average of all dims, usually isotropic but just in case
  const dimensionValues = Object.values(dimensions)
  const averageUnit =
    dimensionValues.reduce((a: number, b: DimensionValue) => a + b[0], 0) /
    dimensionValues.length
  return averageUnit
}

export function replaceOnlyTomogramSource(
  incomingState: NeuroglancerState,
  newPath: string,
) {
  const newState = incomingState
  const tomogramLayer = newState.layers?.find((l) => l.type === 'image')
  if (tomogramLayer) {
    // Replace either the source directly or the url inside the source object
    if (typeof tomogramLayer.source === 'string') {
      tomogramLayer.source = newPath
    } else {
      tomogramLayer.source.url = newPath
    }
  }
  return newState
}

export function replaceOnlyTomogram(
  incomingState: NeuroglancerState,
  newState: NeuroglancerState,
) {
  // The first image layer is always the tomogram -- we can completely replace that layer
  // For the other layers, we only need to adjust the "source" because they can have
  // different transforms needed
  if (!newState.layers) return incomingState
  const incomingLayers = newState.layers
  const newTomogramLayer = incomingLayers.find((l) => l.type === 'image')
  if (!newTomogramLayer) return incomingState // No tomogram layer in the new state
  newTomogramLayer.visible = true
  newTomogramLayer.archived = false
  const newLayers = incomingState.layers || []

  // First, let's check for the tomogram layer in the current state
  const tomogramLayerIndex = newLayers.findIndex((l) => l.type === 'image')
  if (tomogramLayerIndex === -1) {
    newLayers.unshift(newTomogramLayer)
  } else {
    const currentTomogram = newLayers[tomogramLayerIndex]
    const openedTab = currentTomogram.tab
    if (openedTab) {
      newTomogramLayer.tab = openedTab
    }
    newLayers[tomogramLayerIndex] = newTomogramLayer
  }

  // For the other layers, we need to update their sources if they exist in both states
  for (const newLayer of incomingLayers) {
    if (newLayer.type === 'image') continue // Skip the tomogram layer
    const matchingLayer = newLayers.find(
      (l) => getLayerSourceUrl(l) === getLayerSourceUrl(newLayer),
    )
    if (matchingLayer) {
      matchingLayer.source = newLayer.source
    } else {
      newLayers.push(newLayer)
    }
  }

  // Adjust the zoom levels and position to keep view consistent when switching
  const currentSpacing = inferVoxelSpacingFromState(incomingState)
  const newSpacing = inferVoxelSpacingFromState(newState)
  const voxelRatio = newSpacing / currentSpacing
  const newCrossSectionScale = incomingState.crossSectionScale
    ? incomingState.crossSectionScale * voxelRatio
    : undefined
  const newProjectionScale = incomingState.projectionScale
    ? incomingState.projectionScale * voxelRatio
    : undefined
  const newPosition = incomingState.position
    ? incomingState.position.map((x) => x * voxelRatio)
    : undefined
  return {
    ...incomingState,
    layers: newLayers,
    crossSectionScale: newCrossSectionScale,
    projectionScale: newProjectionScale,
    position: newPosition,
  }
}

export function isDepositionActivated(
  depositionEntries: (string | undefined)[],
) {
  const layers = currentNeuroglancerState().layers || []
  return layers
    .filter((l) => l.name && depositionEntries.includes(l.name))
    .some(
      (l) =>
        !resolveStateBool(l.archived, /* defaultValue = */ false) &&
        resolveStateBool(l.visible, /* defaultValue = */ true),
    )
}

export function toggleDepositions(depositionEntries: (string | undefined)[]) {
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

export function toggleAllDepositions() {
  updateState((state) => {
    const layers = state.neuroglancer?.layers || []
    const layersOfInterest = layers.filter((l) => l.type !== 'image')
    const archived = layersOfInterest.some(
      (l) =>
        resolveStateBool(l.archived, /* defaultValue = */ false) &&
        resolveStateBool(l.visible, /* defaultValue = */ true),
    )
    for (const layer of layersOfInterest) {
      layer.archived = !archived
      layer.visible = archived
    }
    return state
  })
}

export function isAllLayerActive() {
  const layers = currentNeuroglancerState().layers || []
  const layersOfInterest = layers.filter((l) => l.type !== 'image')
  return layersOfInterest.every(
    (l) =>
      !resolveStateBool(l.archived, /* defaultValue = */ false) &&
      resolveStateBool(l.visible, /* defaultValue = */ true),
  )
}
