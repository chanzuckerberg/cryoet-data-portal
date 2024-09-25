import { AccordionMetadataTable } from 'app/components/AccordionMetadataTable'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'
import { getTableData } from 'app/utils/table'
import { isFiducial } from 'app/utils/tomograms'

import { Matrix4x4 } from './Matrix4x4'

export function TomogramsMetadataSection() {
  const { run } = useRunById()

  const tomo = run.tomogram_voxel_spacings.at(0)?.tomograms.at(0)

  if (!tomo) {
    return null
  }

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
        isFiducial(tomo.fiducial_alignment_status) ? i18n.true : i18n.false,
      ],
    },
    {
      label: i18n.ctfCorrected,
      values: [tomo.ctf_corrected ? i18n.yes : i18n.no],
    },
    {
      label: i18n.affineTransformationMatrix,
      values: [tomo.affine_transformation_matrix?.flat().join(' ') ?? ''],
      renderValue: (value: string) => {
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
