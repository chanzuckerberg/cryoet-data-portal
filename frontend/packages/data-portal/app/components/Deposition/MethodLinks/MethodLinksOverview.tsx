import { Icon } from '@czi-sds/components'
import { useMemo } from 'react'

import { CollapsibleList } from 'app/components/CollapsibleList'
import { I18n } from 'app/components/I18n'
import { Link } from 'app/components/Link'
import { PageHeaderSubtitle } from 'app/components/PageHeaderSubtitle'
import { Tooltip } from 'app/components/Tooltip'
import {
  methodLabels,
  methodTooltipLabels,
  MethodType,
} from 'app/constants/methodTypes'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'

import {
  CombinedMethodDataType,
  combineSameMethodData,
  generateMethodLinks,
} from './common'
import { MethodDataType, MethodLinkDataType } from './type'

function MethodTypeSection({
  methodType,
  methodLinks,
}: {
  methodType: MethodType
  methodLinks?: MethodLinkDataType[]
}) {
  const { t } = useI18n()
  const links = useMemo(() => generateMethodLinks(methodLinks), [methodLinks])

  return (
    <div className="grid grid-cols-[1fr_2fr] gap-x-sds-xl gap-y-sds-xs">
      <h3 className="text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold uppercase">
        {t('methodType')}
      </h3>
      <p className="flex flex-row gap-sds-xxs text-sds-body-xxs leading-sds-body-xxs col-start-1">
        {t(methodLabels[methodType])}
        <Tooltip
          // FIXME: make arrow centred on icon
          placement="top"
          tooltip={<I18n i18nKey={methodTooltipLabels[methodType]} />}
        >
          <Icon
            sdsIcon="infoCircle"
            sdsSize="xs"
            sdsType="static"
            className="!text-sds-gray-500"
          />
        </Tooltip>
      </p>
      <h3 className="text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold uppercase col-start-2 row-start-1">
        {t('methodLinks')}
      </h3>
      <CollapsibleList
        entries={links?.map((link) => ({
          key: `${link.url}_${link.i18nLabel}_${link.title}`,
          entry: (
            <span className="text-sds-body-xxs leading-sds-body-xxs flex flex-row">
              <span className="text-sds-gray-black items-center flex flex-row">
                {link.icon}
                <span className="font-semibold ml-sds-xxs mr-sds-xs">
                  {t(link.i18nLabel)}:
                </span>
              </span>
              <Link
                to={link.url}
                variant="dashed-underlined"
                className="text-sds-gray-600"
              >
                {link.title ?? link.url}
              </Link>
            </span>
          ),
        }))}
        collapseAfter={1}
      />
    </div>
  )
}

export function MethodLinksOverview() {
  const { t } = useI18n()

  const { deposition } = useDepositionById()

  const combinedMethodData: CombinedMethodDataType[] = useMemo(
    () =>
      combineSameMethodData(
        (deposition?.annotations as MethodDataType[]) ?? [],
      ),
    [deposition],
  )

  const separator = <div className="h-[1px] bg-sds-gray-300" />

  return (
    <div>
      <PageHeaderSubtitle className="mb-sds-m">
        {t('annotationMethodsSummary')}
      </PageHeaderSubtitle>
      <div className="p-sds-l flex flex-col gap-sds-l bg-sds-gray-100 rounded-sds-m">
        {combinedMethodData.map(({ methodData }, i) => (
          <>
            <MethodTypeSection
              methodType={methodData.method_type}
              methodLinks={methodData.method_links}
            />
            {i < combinedMethodData.length - 1 && separator}
          </>
        ))}
      </div>
    </div>
  )
}
