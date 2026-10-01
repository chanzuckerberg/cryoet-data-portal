export interface CompleteStateOfANeuroglancerInstance {
  concurrentDownloads?: number
  crossSectionDepth?: number
  crossSectionOrientation?: number[]
  crossSectionScale?: number
  dimensions?: SpecifiesACoordinateSpace
  displayDimensions?: string[]
  gpuMemoryLimit?: number
  hideCrossSectionBackground3D?: boolean
  layers?: LayerElement[]
  layout?:
    | The2_X2GridLayoutWithXyYzXzAnd3_DPanels
    | DescribesTheRefDataViewsDataViewToDisplay
  position?: number[]
  prefetch?: boolean
  projectionDepth?: number
  projectionOrientation?: number[]
  projectionScale?: number
  relativeDisplayScales?: number[]
  showAxisLines?: boolean
  showDefaultAnnotations?: boolean
  showScaleBar?: boolean
  showSlices?: boolean
  systemMemoryLimit?: number
  title?: string
  wireFrame?: boolean
  [property: string]: unknown
}

export interface SpecifiesACoordinateSpace {
  dimensionName?: Array<number | string>
  [property: string]: unknown
}

export interface LayerElement {
  name?: string
  type?: string
  visible?: boolean
  [property: string]: unknown
}

/**
 * .. list-table::
 *
 * * - `.xy` cross-section view
 * - `.yz` cross-section view
 * * - `.xz` cross-section view
 * - `.3d` projection view
 *
 * If `~ViewerState.showSlices` is ``true``, the `.3d` projection panel
 * also includes the `.xy`, `.yz`, and `.xz` cross-sections as well.
 *
 *
 * .. list-table::
 *
 * * - `.xy` cross-section view
 * - `.xz` cross-section view
 * * - `.3d` projection view
 * - `.yz` cross-section view
 *
 * If `~ViewerState.showSlices` is ``true``, the `.3d` projection panel
 * also includes the `.xy`, `.xz`, and `.yz` cross-sections as well.
 *
 * .. note::
 *
 * This layout contains the same panels as `.4panel-alt`, but in a
 * different arrangement.
 *
 *
 * with the first display dimension (red)
 * pointing right, the second display dimension (green) pointing down, and
 * the third display dimension (blue) pointing away from the camera.
 */
export type The2_X2GridLayoutWithXyYzXzAnd3_DPanels =
  | '4panel-alt'
  | '4panel'
  | 'xy'
  | 'xz'
  | 'yz'
  | '3d'
  | 'xy-3d'
  | 'xz-3d'
  | 'yz-3d'

export interface DescribesTheRefDataViewsDataViewToDisplay {
  orthographicProjection?: boolean
  type: string
  flex?: number
  [property: string]: unknown
}

export interface LayerWithinANeuroglancerInstance {
  name?: string
  type?: string
  visible?: boolean
  [property: string]: unknown
}
