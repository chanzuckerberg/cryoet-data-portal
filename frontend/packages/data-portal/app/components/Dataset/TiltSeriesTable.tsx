import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'

import { AccordionMetadataTable } from './AccordionMetadataTable'
import { getTableData } from './utils'

export function TiltSeriesTable() {
  const dataset = useDatasetById()

  const tiltSeriesData = dataset.runs[0]?.tiltseries[0]
  const tiltSeries = tiltSeriesData
    ? getTableData(
        {
          label: i18n.accelerationVoltage,
          values: [
            `${tiltSeriesData.acceleration_voltage as unknown as number}`,
          ],
        },
        {
          label: i18n.sphericalAberrationConstant,
          values: [`${tiltSeriesData.spherical_aberration_constant}`],
        },
        {
          label: i18n.microscopeManufacturer,
          values: [tiltSeriesData.microscope_manufacturer],
        },
        {
          label: i18n.microscopeModel,
          values: [tiltSeriesData.microscope_model],
        },
        {
          label: i18n.energyFilter,
          values: [tiltSeriesData.microscope_energy_filter],
        },
        {
          label: i18n.phasePlate,
          values: [tiltSeriesData.microscope_phase_plate ?? 'None'],
        },
        {
          label: i18n.imageCorrector,
          values: [tiltSeriesData.microscope_image_corrector ?? 'None'],
        },
        {
          label: i18n.additionalMicroscopeOpticalSetup,
          values: [tiltSeriesData.microscope_additional_info ?? 'None'],
        },
        {
          label: i18n.cameraManufacturer,
          values: [tiltSeriesData.camera_manufacturer],
        },
        {
          label: i18n.cameraModel,
          values: [tiltSeriesData.camera_model],
        },
      )
    : []

  return (
    <AccordionMetadataTable
      id="tilt-series"
      header={i18n.tiltSeries}
      data={tiltSeries}
    />
  )
}
