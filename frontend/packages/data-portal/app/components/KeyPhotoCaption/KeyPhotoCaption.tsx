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
  // 03/25 (smccanny): Hardcode dataset ids that have author submitted images for now
  // because there is not way to distinguish them.
  // This will be revisited when we have a Bring Your Own Data feature.
  const AUTHOR_SUBMITTED_IMAGES_DATASET_IDS = [
    10000, 10001, 10002, 10005, 10006,
  ]
  if (type === DATA_TYPES.RUN) {
    if (
      data?.dataset?.deposition?.annotationsAggregate?.aggregate?.[0]?.count &&
      data.tomogramId
    ) {
      return (
        <I18n
          i18nKey="keyPhotoCaptionRunWithAnnotations"
          values={{ tomogramId: data.tomogramId }}
        />
      )
    }
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
