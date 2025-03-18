import { Callout, CalloutTitle } from '@czi-sds/components'

import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramV2 } from 'app/types/gql/runPageTypes'
import { getTomogramName } from 'app/utils/tomograms'

import { CopyBox } from '../CopyBox'
import { I18n } from '../I18n'

export interface AnnotationAlignmentCalloutProps {
  alignmentId: number
  initialState: 'open' | 'closed'
  misalignedTomograms: TomogramV2[]
}

export function AnnotationAlignmentCallout({
  alignmentId,
  initialState,
  misalignedTomograms,
}: AnnotationAlignmentCalloutProps) {
  const { t } = useI18n()

  return (
    <Callout
      className="!w-full !mt-sds-xl !mb-sds-xxs"
      intent="notice"
      sdsStage={initialState}
      body={
        <>
          <CalloutTitle>
            <p className="text-sds-body-xs-400-wide leading-sds-body-xs">
              <I18n i18nKey="annotationsMayRequireTransformation" />
            </p>
          </CalloutTitle>
          <p className="text-sds-header-xs-600-wide leading-sds-header-xs mt-sds-default font-semibold">
            {t('alignmentId')}
          </p>
          <CopyBox content={alignmentId} />

          {misalignedTomograms.length > 0 && (
            <>
              <p className="text-sds-body-xs-400-wide leading-sds-body-xs mt-[10px]">
                <I18n i18nKey="thisAnnotationRequiresTransformation" />
              </p>

              <div className="bg-[#ffdb97] flex flex-col gap-[12px] mt-sds-xxs p-sds-s rounded-[2px]">
                {misalignedTomograms.map((tomogram) => (
                  <div className="text-sds-body-xxs-400-wide !leading-[18px]">
                    <div className="font-semibold">
                      {getTomogramName(tomogram)}
                    </div>
                    <div>
                      Tomogram ID: {IdPrefix.Tomogram}-{tomogram.id}
                    </div>
                    {tomogram.alignment != null && (
                      <div>
                        Alignment ID: {IdPrefix.Alignment}-
                        {tomogram.alignment.id}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      }
    />
  )
}
