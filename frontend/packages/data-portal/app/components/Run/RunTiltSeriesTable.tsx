import { TiltSeriesKeys, TiltSeriesTable } from 'app/components/TiltSeriesTable'
import { useRunById } from 'app/hooks/useRunById'

const SELECT_FIELDS = [
  TiltSeriesKeys.MicroscopeManufacturer,
  TiltSeriesKeys.MicroscopeModel,
  TiltSeriesKeys.PhasePlate,
  TiltSeriesKeys.ImageCorrector,
  TiltSeriesKeys.AdditionalMicroscopeOpticalSetup,
  TiltSeriesKeys.AccelerationVoltage,
  TiltSeriesKeys.SphericalAberrationConstant,
  TiltSeriesKeys.CameraManufacturer,
  TiltSeriesKeys.CameraModel,
  TiltSeriesKeys.EnergyFilter,
]

export function RunTiltSeriesTable() {
  const { run } = useRunById()

  return (
    <TiltSeriesTable
      tiltSeriesData={run.tiltseries[0]}
      fields={SELECT_FIELDS}
    />
  )
}
