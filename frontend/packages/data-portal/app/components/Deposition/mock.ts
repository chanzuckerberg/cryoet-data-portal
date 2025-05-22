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
