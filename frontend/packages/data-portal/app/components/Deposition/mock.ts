// TODO replace with real interfaces and data from backend

export interface TomogramMethodItem {
  count: number
  voxelSpacing: number
  reconstructionMethod: string
  postProcessing: string
  ctfCorrected: boolean
}

export const TOMOGRAM_METHOD_MOCK_DATA: TomogramMethodItem[] = [
  {
    count: 10,
    voxelSpacing: 2.5,
    reconstructionMethod: 'WBP',
    postProcessing: 'Denoised',
    ctfCorrected: true,
  },
  {
    count: 20,
    voxelSpacing: 4.99,
    reconstructionMethod: 'WBP',
    postProcessing: 'Denoised',
    ctfCorrected: false,
  },
]

export interface AcquisitionMethodItem {
  microscope: string
  camera: string
  tiltingScheme: string
  pixelSize: number
  energyFilter: string
  electronOptics: string
  phasePlate: string
}

export const ACQUISITION_METHOD_MOCK_DATA: AcquisitionMethodItem[] = [
  {
    microscope: 'FEI - TITAN KRIOS',
    camera: 'FEI - FALCON IV',
    tiltingScheme: 'dose-symmetric',
    pixelSize: 1.05,
    energyFilter: 'SELECTRIS',
    electronOptics: '300 kV / Cs = 2.7 mm',
    phasePlate: 'LPP',
  },
  {
    microscope: 'FEI - TITAN KRIOS',
    camera: 'FEI - FALCON IV',
    tiltingScheme: 'dose-symmetric',
    pixelSize: 1.05,
    energyFilter: 'SELECTRIS',
    electronOptics: '300 kV / Cs = 2.7 mm',
    phasePlate: 'LPP',
  },
]
