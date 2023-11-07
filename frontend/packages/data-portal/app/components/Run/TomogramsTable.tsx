import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { getTableData } from 'app/components/utils'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'

import { Matrix4x4 } from './Matrix4x4'

export function TomogramsTable() {
  const { run } = useRunById()

  const tomo = run.tomogram_voxel_spacings[0].tomograms[0]

  const tomogramsTableData = getTableData(
    {
      label: i18n.reconstructionSoftware,
      values: [tomo.reconstruction_software],
    },
    {
      label: i18n.reconstructionMethod,
      values: [tomo.reconstruction_method],
      className: 'capitalize',
    },
    {
      label: i18n.processingSoftware,
      values: [tomo.processing_software ?? ''],
    },
    {
      label: i18n.availableProcessing,
      values: [tomo.processing],
      className: 'capitalize',
    },
    {
      label: i18n.smallestAvailableVoxelSpacing,
      values: [i18n.unitAngstrom(+tomo.voxel_spacing)],
    },
    {
      label: `${i18n.size} (x, y, z)`,
      values: [`(${tomo.size_x}, ${tomo.size_y}, ${tomo.size_z}) px`],
    },
    {
      label: i18n.fiducialAlignmentStatus,
      values: [
        tomo.fiducial_alignment_status === 'FIDUCIAL' ? i18n.true : i18n.false,
      ],
    },
    {
      label: i18n.ctfCorrected,
      values: [tomo.ctf_corrected ? i18n.yes : i18n.no],
    },
    {
      label: i18n.affineTransformationMatrix,
      values: ['1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1'],
      renderValue: (value) => {
        return <Matrix4x4 matrix={value} />
      },
    },
  )

  return (
    <AccordionMetadataTable
      header={i18n.tomograms}
      id="tomograms-metadata"
      data={tomogramsTableData}
    />
  )
}
