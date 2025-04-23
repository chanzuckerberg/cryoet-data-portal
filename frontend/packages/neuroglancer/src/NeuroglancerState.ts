// Do not modify this file: it is generated from JSON schemas defined in Neuroglancer.
export interface CompleteStateOfANeuroglancerInstance {
    concurrentDownloads?:          number;
    crossSectionDepth?:            number;
    crossSectionOrientation?:      number[];
    crossSectionScale?:            number;
    dimensions?:                   SpecifiesACoordinateSpace;
    displayDimensions?:            string[];
    gpuMemoryLimit?:               number;
    hideCrossSectionBackground3D?: boolean;
    layers?:                       LayerElement[];
    layout?:                       The2_X2GridLayoutWithXyYzXzAnd3_DPanels | DescribesTheRefDataViewsDataViewToDisplay;
    position?:                     number[];
    prefetch?:                     boolean;
    projectionDepth?:              number;
    projectionOrientation?:        number[];
    projectionScale?:              number;
    relativeDisplayScales?:        number[];
    showAxisLines?:                boolean;
    showDefaultAnnotations?:       boolean;
    showScaleBar?:                 boolean;
    showSlices?:                   boolean;
    systemMemoryLimit?:            number;
    title?:                        string;
    wireFrame?:                    boolean;
    [property: string]: any;
}

export interface SpecifiesACoordinateSpace {
    dimensionName?: Array<number | string>;
    [property: string]: any;
}

export interface LayerElement {
    name?:    string;
    type?:    string;
    visible?: boolean;
    [property: string]: any;
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
export enum The2_X2GridLayoutWithXyYzXzAnd3_DPanels {
    The3D = "3d",
    The4Panel = "4panel",
    The4PanelAlt = "4panel-alt",
    Xy = "xy",
    Xy3D = "xy-3d",
    Xz = "xz",
    Xz3D = "xz-3d",
    Yz = "yz",
    Yz3D = "yz-3d",
}

export interface DescribesTheRefDataViewsDataViewToDisplay {
    orthographicProjection?: boolean;
    type:                    string;
    flex?:                   number;
    [property: string]: any;
}

export interface LayerWithinANeuroglancerInstance {
    name?:    string;
    type?:    string;
    visible?: boolean;
    [property: string]: any;
}
