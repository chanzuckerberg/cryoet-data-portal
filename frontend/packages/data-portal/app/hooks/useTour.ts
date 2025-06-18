import {
  currentState,
  encodeState,
  NeuroglancerState,
  updateState,
} from 'neuroglancer'
import { useState } from 'react'
import { ACTIONS } from 'react-joyride'

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

const adjustPanelSize = (stringState: string) => {
  const state = JSON.parse(stringState) as NeuroglancerState
  if (state.layerListPanel) {
    state.layerListPanel.size = WALKTHROUGH_PANEL_SIZE
  }
  if (state.selectedLayer) {
    state.selectedLayer.size = WALKTHROUGH_PANEL_SIZE
  }
  return encodeState(state, /* compress = */ false)
}

export interface Annotation {
  depositionId: number
  httpsMetadataPath: string
  deposition: {
    title: string
  }
}

export interface Annotations {
  edges: [
    {
      node: Annotation
    },
  ]
}

export interface Run {
  id: number
  name?: string
  dataset: {
    id: number
    title: string
  }
  annotations: Annotations
}

export interface Tomogram {
  id: string
  name?: string
  run: Run
  dataset: string
  neuroglancerConfig: string
}

export function useTour(tomogram: Tomogram) {
  const [tourRunning, setTourRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState<number>(0)

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
    // To keep the tour in sync with the state, we need to update the
    // state, and then then tour index in the state update callback
    const updateTourStepFromState = (layerControlVisibility: boolean) => {
      updateState((state) => {
        const newState = state
        newState.neuroglancer.selectedLayer!.visible = layerControlVisibility
        newState.tourStepIndex = newIndex
        return newState
      })
    }

    const newIndex = action === ACTIONS.NEXT ? index + 1 : index - 1
    if (newIndex < 3 || newIndex > 5) setStepIndex(newIndex)
    else if (newIndex === 4)
      updateTourStepFromState(false /* layerControlVisibility = */)
    else {
      // On step 3 and 5 we may not need to update the state,
      const { neuroglancer } = currentState()
      const isPanelVisible = boolValue(
        neuroglancer.selectedLayer?.visible,
        panelsDefaultValues.selectedLayer,
      )
      if (isPanelVisible) {
        setStepIndex(newIndex)
      } else {
        updateTourStepFromState(true /* layerControlVisibility = */)
      }
    }
  }

  const handleRestart = () => {
    setTourRunning(false)
    setTimeout(() => {
      setStepIndex(0)
      setTourRunning(true)
    }, 300)
  }

  return {
    tourRunning,
    setTourRunning,
    stepIndex,
    setStepIndex,
    handleTourClose,
    handleRestart,
    handleTourStepMove,
    handleTourStartInNewTab,
  }
}
