import pako from 'pako'

import {
  CompleteStateOfANeuroglancerInstance,
  LayerElement,
  The2_X2GridLayoutWithXyYzXzAnd3_DPanels,
} from './NeuroglancerState'

// TODO could try to update this in neuroglancer main in the state yaml
// so that the auto-generated types are more complete
// for now, we just extend the auto-generated types from the neuroglancer docs
export interface NeuroglancerState
  extends CompleteStateOfANeuroglancerInstance {
  helpPanel?: PanelState
  settingsPanel?: PanelState
  selectedLayer?: PanelState
  layerListPanel?: PanelState
  selection?: PanelState
  toolPalettes?: Record<string, ToolPaletteState>
  layers?: LayerWithSource[]
  dimensions?: { [key: string]: DimensionValue }
}

export type DimensionValue = [number, string]

export interface SuperState extends Record<string, unknown> {
  neuroglancer: string
}

export interface ResolvedSuperState extends Record<string, unknown> {
  neuroglancer: NeuroglancerState
}

export type NeuroglancerLayout = `${The2_X2GridLayoutWithXyYzXzAnd3_DPanels}`

export type NeurogancerAwareContentWindow = Window & {
  neuroglancer?: NeuroglancerViewer
}

export type NeuroglancerAwareIframe = HTMLIFrameElement & {
  contentWindow: NeurogancerAwareContentWindow | null
}

// The neuroglancer viewer has more available properties,
// here we define a subset of the properties on the viewer
export interface NeuroglancerViewer {
  element: HTMLElement
  showDefaultAnnotations: WatchableBoolean
  showAxisLines: WatchableBoolean
  showScaleBar: WatchableBoolean
  showPerspectiveSliceViews: WatchableBoolean
  navigationState: {
    pose: {
      orientation: {
        snap: () => void
      }
    }
  }
  perspectiveNavigationState: {
    pose: {
      orientation: {
        snap: () => void
      }
    }
  }
  uiConfiguration: {
    showLayerPanel: WatchableBoolean // This is the top layer bar
  }
}

interface PanelState {
  visible?: boolean
  side?: 'left' | 'right' | 'top' | 'bottom' | undefined
  row?: number
  size?: number
  layer?: string
}

interface ToolPaletteState extends PanelState {
  query?: string
  verticalStacking?: boolean
}

interface LayerWithSource extends LayerElement {
  source:
    | string
    | {
        url: string
        transform?: { outputDimensions: unknown; inputDimensions: unknown }
      }
  archived?: boolean
}

interface WatchableBoolean {
  value: boolean
}

export function getLayerSourceUrl(layer: LayerWithSource): string {
  if (typeof layer.source === 'string') {
    return layer.source
  }
  return layer.source.url
}

const emptySuperState = (config: string): SuperState => {
  return {
    neuroglancer: config.length > 0 ? decompressHash(config) : '',
  }
}

export const updateState = (
  onStateChange: (state: ResolvedSuperState) => ResolvedSuperState | undefined,
) => {
  const state = currentState()
  const newState = onStateChange(state)
  if (newState === undefined) {
    return
  }
  commitState(newState)
}

export const newSuperState = (config: string): SuperState => {
  const state = parseSuperState(config)
  if (state.neuroglancer) {
    return state
  }
  return emptySuperState(config)
}

export const updateNeuroglancerConfigInSuperstate = (
  superstate: SuperState,
  neuroglancerHash: string,
): SuperState => {
  superstate.neuroglancer = neuroglancerHash
  return superstate
}

export const parseSuperState = (
  hash: string,
  previous?: SuperState,
): SuperState => {
  if (!hash || hash.length === 0) {
    return emptySuperState('')
  }
  const superState = parseState(hash)
  if (!superState.neuroglancer) {
    if (previous) {
      previous.neuroglancer = decompressHash(hash)
      return previous
    }
    return emptySuperState(hash)
  }
  return { ...superState, neuroglancer: superState.neuroglancer as string }
}

export const extractConfigFromSuperState = (hash: string): string => {
  const superstate = parseState(hash)
  return (superstate.neuroglancer as string) || ''
}

export function hash2jsonString(hash: string): string {
  if (hash?.startsWith('#!')) {
    return hash.slice(2)
  }
  return hash
}

// Helper functions for parsing and encoding state
export const currentState = (
  hash = window.location.hash,
): ResolvedSuperState => {
  const superState = parseSuperState(hash)
  if (superState.neuroglancer) {
    return { ...superState, neuroglancer: parseState(superState.neuroglancer) }
  }
  return { ...superState, neuroglancer: {} }
}

export const currentNeuroglancerState = (
  hash = window.location.hash,
): NeuroglancerState => {
  const superState = parseState(hash)
  if (superState.neuroglancer) {
    return parseState(superState.neuroglancer as string)
  }
  return superState
}

export const currentSuperState = (hash = window.location.hash) => {
  return parseSuperState(hash)
}

export const commitState = (state: SuperState | ResolvedSuperState) => {
  state.neuroglancer = encodeState(state.neuroglancer, /* compress = */ false)
  const newHash = encodeState(state)
  window.location.hash = newHash // This triggers the hashchange listener
}

export const parseState = (
  hashState: string,
): SuperState | NeuroglancerState => {
  if (!hashState || hashState.length === 0) {
    return emptySuperState('')
  }
  const hash = decompressHash(hash2jsonString(hashState))
  const decodedHash = decodeURIComponent(hash)
  return JSON.parse(hash2jsonString(decodedHash)) as
    | SuperState
    | NeuroglancerState
}

export const encodeState = (
  jsonObject: unknown,
  compress: boolean = true,
): string => {
  const jsonString = JSON.stringify(jsonObject)
  const encodedString = encodeURIComponent(jsonString)
  if (compress) {
    return compressHash(encodedString)
  }
  return `#!${encodedString}`
}

// Helper functions for parsing, compressing and decompressing hash
function b64Tob64Url(buffer: string): string {
  return buffer.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function b64UrlTo64(value: string): string {
  const m = value.length % 4
  return value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(value.length + (m === 0 ? 0 : 4 - m), '=')
}

export function hashIsUncompressed(hash: string): boolean {
  return hash?.includes('%')
}

export function hashIsCompressed(hash: string): boolean {
  return !hashIsUncompressed(hash)
}

export function compressHash(hash: string): string {
  if (hashIsCompressed(hash)) {
    return hash
  }
  const gzipHash = pako.gzip(hash2jsonString(hash))
  // @ts-expect-error: UInt8Array and number[] are compatible in this context
  const base64UrlFragment = btoa(String.fromCharCode.apply(null, gzipHash))
  const newHash = `#!${b64Tob64Url(base64UrlFragment)}`
  return newHash
}

export function decompressHash(hash: string): string {
  if (hashIsUncompressed(hash)) {
    return hash
  }
  const base64Hash = b64UrlTo64(hash2jsonString(hash))
  const gzipedHash = Uint8Array.from(atob(base64Hash), (c) => c.charCodeAt(0))
  const hashFragment = new TextDecoder().decode(pako.ungzip(gzipedHash))
  return `#!${hashFragment}`
}

export function currentNeuroglancer(
  neuroglancerIframeID = 'neuroglancerIframe',
): NeuroglancerViewer | undefined {
  const frameElement = document.getElementById(neuroglancerIframeID) as
    | HTMLIFrameElement
    | undefined
  return (frameElement?.contentWindow as NeurogancerAwareContentWindow)
    ?.neuroglancer
}
