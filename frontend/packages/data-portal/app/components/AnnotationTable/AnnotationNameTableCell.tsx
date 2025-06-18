import { I18n } from 'app/components/I18n'
import { Tooltip } from 'app/components/Tooltip'
import { IdPrefix } from 'app/constants/idPrefixes'
import { TestIds } from 'app/constants/testIds'
import { useI18n } from 'app/hooks/useI18n'
import { cns, cnsNoMerge } from 'app/utils/cns'

export function AnnotationNameTableCell({
  annotationId,
  groundTruthStatus,
  objectName,
  s3Path,
}: {
  annotationId?: number
  groundTruthStatus?: boolean | null
  objectName?: string
  s3Path?: string
}) {
  const { t } = useI18n()

  return (
    <div>
      <p
        className={cns(
          'text-sds-body-m-400-wide leading-sds-body-m font-semibold',
          'text-ellipsis line-clamp-2 break-all',
        )}
      >
        <span className="pr-sds-xs">{s3Path && parseFilePath(s3Path)}</span>
        <span>{objectName}</span>
      </p>

      <div className="flex items-center gap-sds-xxs">
        <p className="text-sds-body-xxs-400-wide leading-sds-body-xxs">
          <span>
            {t('annotationId')}: {IdPrefix.Annotation}-
          </span>
          <span data-testid={TestIds.AnnotationId}>{annotationId}</span>
        </p>

        {groundTruthStatus && (
          <Tooltip
            tooltip={<I18n i18nKey="groundTruthTooltip" />}
            placement="top"
          >
            <div
              className={cnsNoMerge(
                'px-sds-xs py-sds-xxxs',
                'flex items-center justify-center',
                'rounded-sds-m bg-light-sds-color-primitive-blue-200',
                'text-sds-body-xxxs-400-wide leading-sds-body-xxxs text-light-sds-color-primitive-blue-600 whitespace-nowrap',
              )}
            >
              {t('groundTruth')}
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

function parseFilePath(filePath: string) {
  const path = filePath.split('/')
  return path.at(-2)
}
