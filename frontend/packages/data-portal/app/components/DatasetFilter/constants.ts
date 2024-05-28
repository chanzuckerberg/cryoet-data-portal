import { AvailableFilesFilterValue } from 'app/types/filter'
import { I18nKeys } from 'app/types/i18n'

export const AVAILABLE_FILES_VALUE_TO_I18N_MAP: Record<
  AvailableFilesFilterValue,
  I18nKeys
> = {
  'raw-frames': 'rawFrames',
  'tilt-series': 'tiltSeries',
  'tilt-series-alignment': 'tiltSeriesAlignment',
  tomogram: 'tomograms',
}
