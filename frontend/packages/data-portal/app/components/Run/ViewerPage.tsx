import './ViewerPage.css'

import { useLocation } from '@remix-run/react'
import { currentState, NeuroglancerWrapper, updateState } from 'neuroglancer'
import { useState } from 'react'
import Tour from './Tour'
import { getTutorialSteps } from './steps';

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

const CRYOET_PORTAL_DOC_URL =
  'https://chanzuckerberg.github.io/cryoet-data-portal/neuroglancer_quickstart.html#neuroglancer-quickstart'
const EXAMPLE_CRYOET_HASH =
  '#!%7B%22dimensions%22:%7B%22x%22:%5B4.99e-10%2C%22m%22%5D%2C%22y%22:%5B4.99e-10%2C%22m%22%5D%2C%22z%22:%5B4.99e-10%2C%22m%22%5D%7D%2C%22position%22:%5B632%2C632%2C185%5D%2C%22crossSectionScale%22:3.16%2C%22projectionOrientation%22:%5B0.3826834261417389%2C0%2C0%2C0.9238795042037964%5D%2C%22projectionScale%22:1390.4%2C%22layers%22:%5B%7B%22type%22:%22image%22%2C%22source%22:%22zarr://https://files.cryoetdataportal.cziscience.com/10444/24may06a_Position_1_2/Reconstructions/VoxelSpacing4.990/Tomograms/100/24may06a_Position_1_2.zarr%22%2C%22tab%22:%22rendering%22%2C%22opacity%22:0.51%2C%22shader%22:%22#uicontrol%20invlerp%20contrast%5Cn#uicontrol%20bool%20invert_contrast%20checkbox%5Cn%5Cnfloat%20get_contrast%28%29%20%7B%5Cn%20%20return%20invert_contrast%20?%201.0%20-%20contrast%28%29%20:%20contrast%28%29%3B%5Cn%7D%5Cn%5Cnvoid%20main%28%29%20%7B%5Cn%20%20float%20outputValue%3B%5Cn%20%20outputValue%20=%20get_contrast%28%29%3B%5Cn%20%20emitGrayscale%28outputValue%29%3B%5Cn%7D%22%2C%22shaderControls%22:%7B%22contrast%22:%7B%22range%22:%5B-0.000008560898862697286%2C0.000008186889914441053%5D%2C%22window%22:%5B-0.00001023567774041112%2C0.000009861668792154887%5D%7D%7D%2C%22name%22:%2224may06a_Position_1_2%22%7D%2C%7B%22type%22:%22segmentation%22%2C%22source%22:%7B%22url%22:%22precomputed://https://files.cryoetdataportal.cziscience.com/10444/24may06a_Position_1_2/Reconstructions/VoxelSpacing4.990/NeuroglancerPrecompute/100-membrane-1.0_segmentationmask%22%2C%22transform%22:%7B%22outputDimensions%22:%7B%22x%22:%5B4.99e-10%2C%22m%22%5D%2C%22y%22:%5B4.99e-10%2C%22m%22%5D%2C%22z%22:%5B4.99e-10%2C%22m%22%5D%7D%2C%22inputDimensions%22:%7B%22x%22:%5B4.99e-10%2C%22m%22%5D%2C%22y%22:%5B4.99e-10%2C%22m%22%5D%2C%22z%22:%5B4.99e-10%2C%22m%22%5D%7D%7D%7D%2C%22tab%22:%22rendering%22%2C%22selectedAlpha%22:1%2C%22hoverHighlight%22:false%2C%22segments%22:%5B%221%22%5D%2C%22segmentDefaultColor%22:%22#a66120%22%2C%22name%22:%22100%20membrane%20segmentation%22%7D%5D%2C%22selectedLayer%22:%7B%22visible%22:true%2C%22layer%22:%2224may06a_Position_1_2%22%7D%2C%22crossSectionBackgroundColor%22:%22#000000%22%2C%22layout%22:%224panel%22%7D'

function ViewerPage() {
  const cryoetUrl = CRYOET_PORTAL_DOC_URL
  const exampleHash = EXAMPLE_CRYOET_HASH

  const providerUrl = useLocation()
  const runId = providerUrl.pathname.toString().match(/.*\/(\d+)\/$/)![1]
  const [run, setRun] = useState(false);
  const [hasAnnotations, setHasAnnotations] = useState(
    hasAnnotationLayers(currentState()),
  )

  const updateButtons = (state: any) => {
    setHasAnnotations(hasAnnotationLayers(state))
  }

  const handleTutorialStart = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setRun(true)
  }

  const handleTourClose = () => {
    setRun(false)
  }

  return (
    <div className="main-container">
      <header className="main-header">
        <a href={cryoetUrl} target="_blank" rel="noopener noreferrer">
          <button className="cryoet-doc-button">View documentation</button>
        </a>
        <a href={cryoetUrl} target="_blank" rel="noopener noreferrer">
          <button className="cryoet-doc-button" onClick={handleTutorialStart}>View tutorial</button>
        </a>
        <p className="portal-title">
          CryoET data portal neuroglancer coming from{' '}
          {providerUrl.pathname.toString()}
        </p>
        <div className="button-group">
          <a href={`/runs/${runId}`}>
            <button className="toggle-button"> Go back to run</button>
          </a>
          <button
            className="toggle-button"
            onClick={() => {
              window.location.hash = exampleHash
            }}
          >
            Load example data
          </button>
          <button className="toggle-button" onClick={toggleLayersVisibility}>
            Toggle layers visibility
          </button>
          {hasAnnotations && (
            <button className="toggle-button" onClick={toggleAnnotations}>
              Toggle annotations
            </button>
          )}
        </div>
      </header>
      <div className="iframe-container">
        <NeuroglancerWrapper onStateChange={updateButtons} />
      </div>
      {run && <Tour run={run} steps={getTutorialSteps()} onClose={handleTourClose}/>}
    </div>
  )
}

export default ViewerPage
