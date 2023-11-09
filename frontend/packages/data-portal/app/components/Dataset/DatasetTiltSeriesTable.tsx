import { TiltSeriesKeys, TiltSeriesTable } from 'app/components/TiltSeriesTable'
import { useDatasetById } from 'app/hooks/useDatasetById'

const SELECT_FIELDS = [
  TiltSeriesKeys.AccelerationVoltage,
  TiltSeriesKeys.SphericalAberrationConstant,
  TiltSeriesKeys.MicroscopeManufacturer,
  TiltSeriesKeys.MicroscopeModel,
  TiltSeriesKeys.EnergyFilter,
  TiltSeriesKeys.PhasePlate,
  TiltSeriesKeys.ImageCorrector,
  TiltSeriesKeys.AdditionalMicroscopeOpticalSetup,
  TiltSeriesKeys.CameraManufacturer,
  TiltSeriesKeys.CameraModel,
]

export function DatasetTiltSeriesTable() {
  const { dataset } = useDatasetById()

  return (
    <TiltSeriesTable
      tiltSeriesData={dataset.run_metadata[0].tiltseries[0]}
      fields={SELECT_FIELDS}
    />
  )
}
