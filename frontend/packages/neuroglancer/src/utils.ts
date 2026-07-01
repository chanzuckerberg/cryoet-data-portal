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
  tab: string
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

// In-memory source of truth for the current viewer state, published by the
// wrapper each frame. Reads below prefer it so they stay fresh while the URL is
// written lazily; null falls back to parsing window.location.hash.
let liveSuperState: SuperState | null = null

export const setLiveSuperState = (state: SuperState | null): void => {
  liveSuperState = state
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

// Helper functions for parsing and encoding state. Without an explicit hash,
// these read the live state if published, else parse window.location.hash.
export const currentState = (hash?: string): ResolvedSuperState => {
  if (hash === undefined && liveSuperState !== null) {
    return {
      ...liveSuperState,
      neuroglancer: parseState(liveSuperState.neuroglancer),
    }
  }
  const superState = parseSuperState(hash ?? window.location.hash)
  if (superState.neuroglancer) {
    return { ...superState, neuroglancer: parseState(superState.neuroglancer) }
  }
  return { ...superState, neuroglancer: {} }
}

export const currentNeuroglancerState = (hash?: string): NeuroglancerState => {
  if (hash === undefined && liveSuperState !== null) {
    return parseState(liveSuperState.neuroglancer)
  }
  const superState = parseState(hash ?? window.location.hash)
  if (superState.neuroglancer) {
    return parseState(superState.neuroglancer as string)
  }
  return superState
}

export const currentSuperState = (hash?: string): SuperState => {
  if (hash === undefined && liveSuperState !== null) {
    return { ...liveSuperState }
  }
  return parseSuperState(hash ?? window.location.hash)
}

export const commitState = (state: SuperState | ResolvedSuperState) => {
  state.neuroglancer = encodeState(state.neuroglancer, /* compress = */ false)
  // Sync live state before the (async) hashchange, so reads after a commit are fresh.
  setLiveSuperState(state as SuperState)
  const newHash = encodeState(state)
  window.location.hash = newHash // This triggers the hashchange listener
}

// Flush the live state into the URL (compressed) immediately, bypassing the
// settle debounce — for actions that read window.location.href directly (Share).
export const flushStateToUrl = (): void => {
  const superState = liveSuperState ?? parseSuperState(window.location.hash)
  const newHash = encodeState(superState)
  if (window.location.hash !== newHash) {
    window.history.replaceState(null, '', newHash)
  }
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
  // String.fromCharCode.apply fills the stack when the array is large
  // (e.g. many instance segmentation labels), so we need to do it in chunks
  let binaryString = ''
  const chunkSize = 0x8000
  for (let i = 0; i < gzipHash.length; i += chunkSize) {
    binaryString += String.fromCharCode.apply(
      null,
      // @ts-expect-error: Uint8Array and number[] are compatible here
      gzipHash.subarray(i, i + chunkSize),
    )
  }
  const base64UrlFragment = btoa(binaryString)
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
