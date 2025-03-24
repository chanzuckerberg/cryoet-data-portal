import {
  GetDatasetByIdV2Query,
  GetRunByIdV2Query,
  Sample_Type_Enum,
} from 'app/__generated_v2__/graphql'
import { I18n } from 'app/components/I18n'
import { DATA_TYPES } from 'app/constants/dataTypes'

type KeyPhotoRun = GetRunByIdV2Query['runs'][0] & {
  tomogramId?: string | null
}

export type KeyPhotoCaptionProps =
  | { type: DATA_TYPES.DATASET; data: GetDatasetByIdV2Query['datasets'][0] }
  | { type: DATA_TYPES.RUN; data: KeyPhotoRun }
  | { type: DATA_TYPES.DEPOSITION; data?: undefined }

export const getKeyPhotoCaption = ({ type, data }: KeyPhotoCaptionProps) => {
  const AUTHOR_SUBMITTED_IMAGES_DATASET_IDS = [
    10000, 10001, 10002, 10005, 10006,
  ]
  if (type === DATA_TYPES.RUN) {
    if (
      data.tomogramVoxelSpacings.edges.some(
        (edge) =>
          // TODO: (smccanny) what the heck is going on with the types here?
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          edge?.node?.annotationFilesAggregate?.aggregate &&
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          edge.node.annotationFilesAggregate.aggregate?.length > 0 &&
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          edge.node.annotationFilesAggregate.aggregate[0]?.count &&
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          edge.node.annotationFilesAggregate.aggregate[0].count > 0,
      )
    ) {
      return <I18n i18nKey="keyPhotoCaptionRunWithAnnotations" />
    }
    // TODO: (smccanny) add one more case to deal with runs that have annotations but
    // they keyPhoto is not an annotated image

    return data.tomogramId ? (
      <I18n
        i18nKey="keyPhotoCaptionRun"
        values={{ tomogramId: data.tomogramId }}
      />
    ) : null
  }
  if (type === DATA_TYPES.DATASET) {
    if (AUTHOR_SUBMITTED_IMAGES_DATASET_IDS.includes(data.id)) {
      return <I18n i18nKey="keyPhotoCaptionDatasetAuthorContributed" />
    }
    if (data.sampleType === Sample_Type_Enum.InSilico) {
      return <I18n i18nKey="keyPhotoCaptionDatasetInSilico" />
    }
    if (data.sampleType === Sample_Type_Enum.InVitro) {
      return <I18n i18nKey="keyPhotoCaptionDatasetInVitro" />
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (data.deposition?.annotationsAggregate?.aggregate?.[0]?.count) {
      return (
        <I18n
          i18nKey="keyPhotoCaptionDatasetWithAnnotations"
          values={{ organismName: data.organismName }}
        />
      )
    }

    return (
      <I18n
        i18nKey="keyPhotoCaptionDataset"
        values={{ organismName: data.organismName }}
      />
    )
  }
  if (type === DATA_TYPES.DEPOSITION) {
    return <I18n i18nKey="keyPhotoCaptionDepositions" />
  }
  return null
}

export function KeyPhotoCaption({
  caption,
}: {
  caption?: React.ReactNode | null
}) {
  return (
    <p className="mt-sds-xs text-light-sds-color-semantic-base-text-secondary text-sds-body-xxs-400-wide">
      {caption || 'No caption available'}
    </p>
  )
}
