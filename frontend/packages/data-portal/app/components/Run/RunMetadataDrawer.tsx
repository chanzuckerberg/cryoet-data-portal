import { MetadataDrawer } from 'app/components/MetadataDrawer'
import { TiltSeriesTable } from 'app/components/TiltSeriesTable'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'

export function RunMetadataDrawer() {
  const { run } = useRunById()

  return (
    <MetadataDrawer title={run.name} label={i18n.runDetails}>
      <TiltSeriesTable runTiltSeries={run.tiltseries[0]} />
    </MetadataDrawer>
  )
}
