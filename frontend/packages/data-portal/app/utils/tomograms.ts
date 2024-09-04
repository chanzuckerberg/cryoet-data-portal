import { startCase } from 'lodash-es'

export function isFiducial(status: string | null | undefined) {
  return status === 'FIDUCIAL'
}

export function getTomogramName(
  id: number,
  reconstructionMethod: string,
  postProcessing: string,
): string {
  return startCase(`${id} ${reconstructionMethod} ${postProcessing}`)
}
