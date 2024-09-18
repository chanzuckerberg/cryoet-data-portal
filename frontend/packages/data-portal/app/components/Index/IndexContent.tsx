import { useTypedLoaderData } from 'remix-typedjson'

import { LandingPageDataQuery } from 'app/__generated__/graphql'
import { I18n } from 'app/components/I18n'

import { IndexContributors } from './IndexContributors'
import { IndexCTA } from './IndexCTA'

export function IndexContent() {
  const data = useTypedLoaderData<LandingPageDataQuery>()

  const datasets = data.datasets_aggregate.aggregate?.count ?? 0
  const tomograms = data.tomograms_aggregate.aggregate?.count ?? 0

  return (
    <div className="px-sds-xl overflow-x-clip flex flex-col items-center">
      <div className="flex flex-col max-w-content-small py-sds-xxl gap-sds-xxl">
        <div className="flex flex-col gap-sds-xl">
          <h2 className="font-sds-semibold font-semibold text-sds-header-xl leading-sds-header-xl">
            <I18n i18nKey="landingPageWelcomeBlurb" />
          </h2>
          <div className="font-sds-regular text-sds-body-s leading-sds-body-s flex flex-col gap-sds-l">
            <p>
              <I18n i18nKey="landingPageCopy1" />
            </p>
            <p>
              <I18n
                i18nKey="landingPageCopy2"
                values={{
                  count1: tomograms.toLocaleString(),
                  count2: datasets.toLocaleString(),
                }}
              />
            </p>
            <p>
              <I18n i18nKey="landingPageCopy3" />
            </p>
            <p>
              <I18n i18nKey="landingPageCopy4" />
            </p>
            <p>
              <I18n i18nKey="landingPageCopy5" />
            </p>
          </div>
        </div>
        <IndexCTA />
        <IndexContributors />
        <div className="flex flex-col gap-sds-m">
          <div className="flex-initial h-sds-xxxs bg-sds-color-primitive-gray-200" />
          <p className="text-sds-body-xxxs leading-sds-body-xxxs text-sds-color-primitive-gray-600">
            <I18n i18nKey="landingHeaderImageAttribution" />
          </p>
        </div>
      </div>
    </div>
  )
}
