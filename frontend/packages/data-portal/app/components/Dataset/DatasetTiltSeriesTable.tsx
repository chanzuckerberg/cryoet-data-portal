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
      tiltSeriesData={
        dataset.runMetadata.edges[0]?.node.tiltseries.edges[0]?.node
      }
      fields={SELECT_FIELDS}
    />
  )
}
