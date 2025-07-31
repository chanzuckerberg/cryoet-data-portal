import { updateState } from 'neuroglancer'
import { useState } from 'react'
import { ACTIONS } from 'react-joyride'

import { SHOW_TOUR_QUERY_PARAM } from 'app/utils/url'

export function useTour(startingStepIndex: number = 0) {
  const [tourRunning, setTourRunning] = useState(false)
  // Don't directly set the step index, set the state instead in
  // the neuroglancer super state and then the callback for the
  // onStateChange in the viewer page will update the step index
  // in the tour
  const [stepIndex, setStepIndex] = useState<number>(startingStepIndex)
  const [proxyIndex, setProxyIndex] = useState<number>(startingStepIndex)
  const [ignoreStepMove, setIgnoreStepMove] = useState<boolean>(false)

  const resetState = () => {
    setIgnoreStepMove(true)
    updateState((state) => {
      const newState = state
      newState.tourStepIndex = 0
      return newState
    })
    setStepIndex(0)
    setProxyIndex(0)
  }

  const handleTourClose = () => {
    setTourRunning(false)
    resetState()
    setIgnoreStepMove(false)
  }

  const handleTourStart = () => {
    const url = new URL(window.location.href)
    url.searchParams.set(SHOW_TOUR_QUERY_PARAM, 'true')
    window.history.replaceState({}, '', url.toString())
    resetState()
    setTourRunning(true)
    setIgnoreStepMove(false)
  }

  const handleTourStepMove = (
    index: number,
    action: (typeof ACTIONS)[keyof typeof ACTIONS],
  ) => {
    if (ignoreStepMove) {
      setStepIndex(0)
      setProxyIndex(0)
      setIgnoreStepMove(false)
      return
    }

    const newIndex = action === ACTIONS.NEXT ? index + 1 : index - 1
    // To keep the tour in sync with the state, we need to update the
    // state, and then then tour index in the state update callback
    const updateTourStepFromState = (layerControlVisibility?: boolean) => {
      updateState((state) => {
        const newState = state
        if (layerControlVisibility !== undefined) {
          newState.neuroglancer.selectedLayer!.visible = layerControlVisibility
        }
        newState.neuroglancer.layerListPanel!.visible = true
        newState.tourStepIndex = newIndex
        return newState
      })
    }

    if (newIndex === 1 && action === ACTIONS.NEXT) {
      // Special case: starting the tour from the beginning
      // This lets us know when neuroglancer is ready
      // and we can move the proxy elements to the right place
      updateTourStepFromState()
      return
    }

    if (newIndex === 4) {
      // Step 4 always triggers update as we force layer hidden
      updateTourStepFromState(false /* layerControlVisibility = */)
      return
    }

    if (newIndex === 3 || newIndex === 5) {
      updateTourStepFromState(true /* layerControlVisibility = */)
      return
    }

    updateTourStepFromState()
  }

  const handleRestart = () => {
    // Set the tour not running so that the handleStepMove
    // is not called when the step index is set to 0
    setIgnoreStepMove(true)
    resetState()
  }

  return {
    tourRunning,
    setTourRunning,
    stepIndex,
    setStepIndex,
    handleTourStart,
    handleTourClose,
    handleRestart,
    handleTourStepMove,
    proxyIndex,
    setProxyIndex,
  }
}
