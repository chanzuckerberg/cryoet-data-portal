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
  TiltSeriesKeys.DataAcquisitionSoftware,
  TiltSeriesKeys.PixelSpacing,
  TiltSeriesKeys.TiltAxis,
  TiltSeriesKeys.TiltRange,
  TiltSeriesKeys.TiltStep,
  TiltSeriesKeys.TiltingScheme,
  TiltSeriesKeys.TotalFlux,
  TiltSeriesKeys.BinningFromFrames,
  TiltSeriesKeys.SeriesIsAligned,
  // not done on the backend yet
  // TiltSeriesKeys.AlignedBinning,
  TiltSeriesKeys.RelatedEmpiarEntry,
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
