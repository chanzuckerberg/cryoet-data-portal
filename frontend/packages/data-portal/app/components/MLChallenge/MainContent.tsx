import { Icon } from '@czi-sds/components'
import { ReactNode } from 'react'

import { I18n } from 'app/components/I18n'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

function Section({
  children,
  color,
  className,
}: {
  children: ReactNode
  color?: 'primary100' | 'primary200' | 'gray100' | 'gray500'
  className?: string
}) {
  return (
    <div
      className={cns(
        'py-sds-xxl flex flex-col',
        color &&
          'relative after:h-full after:w-[200vw] after:absolute after:top-0 after:-translate-x-1/2 after:-z-10',
        color === 'primary100' && 'after:bg-sds-primary-100 ',
        color === 'primary200' && 'after:bg-sds-primary-200 ',
        color === 'gray100' && 'after:bg-sds-gray-100 ',
        color === 'gray500' && 'after:bg-sds-gray-500 ',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function MainContent() {
  const { t } = useI18n()

  const competitionDetails: [string, ReactNode][] = [
    [t('timeline'), t('timelineSectionContent')],
    [t('location'), <I18n i18nKey="locationSectionContent" />],
    [t('awards'), t('awardsSectionContent')],
    [t('scoring'), t('scoringSectionContent')],
  ]

  return (
    <div className="flex flex-col max-w-content-small">
      <Section className="gap-sds-xxl">
        {/* About the Competition */}
        <div className="flex flex-col gap-sds-xl">
          <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold">
            {t('aboutTheCompetition')}
          </h2>
          <div className="flex flex-col gap-sds-l text-sds-body-s leading-sds-body-s">
            <p>{t('aboutTheCompetitionContent1')}</p>
            <p>{t('aboutTheCompetitionContent2')}</p>
            <p>{t('aboutTheCompetitionContent3')}</p>
            <p>{t('aboutTheCompetitionContent4')}</p>
          </div>
        </div>

        {/* Competition Details */}
        <div className="flex flex-col">
          <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold">
            {t('competitionDetails')}
          </h2>
          {competitionDetails.map(([title, content]) => (
            <>
              <h4 className="text-sds-header-m leading-sds-header-m font-semibold mt-sds-xl">
                {title}
              </h4>
              <span className="text-sds-body-xs leading-sds-xs mt-sds-xs p-sds-m bg-sds-gray-100">
                {content}
              </span>
            </>
          ))}
        </div>
      </Section>
      <Section color="primary100">
        <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold mb-sds-xl">
          {t('howToParticipate')}
        </h2>
        <div>
          <div className="flex flex-row gap-sds-m mb-sds-xs items-center">
            <Icon
              sdsIcon="book"
              color="primary"
              sdsSize="xl"
              sdsType="static"
            />
            <h3 className="text-sds-header-m leading-sds-header-m font-semibold">
              {t('rules')}
            </h3>
          </div>
          <div className="ml-[42px] mb-sds-xxl text-sds-body-s leading-sds-body-s flex flex-col">
            <p className="mb-sds-m">{t('rulesDescription')}</p>
            <ul className="mb-sds-xl gap-sds-xs list-disc ml-[17px]">
              <li>
                <I18n i18nKey="rulesBullet1" />
              </li>
              <li>
                <I18n i18nKey="rulesBullet2" />
              </li>
              <li>
                <I18n i18nKey="rulesBullet3" />
              </li>
              <li>
                <I18n i18nKey="rulesBullet4" />
              </li>
              <li>
                <I18n i18nKey="rulesBullet5" />
              </li>
            </ul>
            <p className="uppercase font-semibold text-sds-caps-xxs leading-sds-caps-xxs text-sds-gray-500">
              {t('moreInfoComingFall2024')}
            </p>
          </div>
        </div>
        <div>
          <div className="flex flex-row gap-sds-m mb-sds-xs items-center">
            <Icon
              sdsIcon="star"
              color="primary"
              sdsSize="xl"
              sdsType="static"
            />
            <h3 className="text-sds-header-m leading-sds-header-m font-semibold">
              {t('gettingStarted')}
            </h3>
          </div>
          <div className="ml-[42px] mb-sds-xxl text-sds-body-s leading-sds-body-s flex flex-col">
            <p className="mb-sds-m">
              <I18n i18nKey="gettingStartedDescription" />
            </p>
            <ul className="mb-sds-xl gap-sds-xs list-disc ml-[17px]">
              <li>
                <I18n i18nKey="gettingStartedBullet1" />
              </li>
              <li>
                <I18n i18nKey="gettingStartedBullet2" />
              </li>
              <li>
                <I18n i18nKey="gettingStartedBullet3" />
              </li>
            </ul>
            <p className="uppercase font-semibold text-sds-caps-xxs leading-sds-caps-xxs text-sds-gray-500">
              {t('moreInfoComingFall2024')}
            </p>
          </div>
        </div>
      </Section>
      {/* TODO: Competition Data */}
      <Section className="!p-0">
        <div className="flex flex-col gap-sds-xl min-h-[270px] py-sds-xxl">
          <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold">
            {t('aboutCryoEtData')}
          </h2>
          <p className="text-sds-caps-xxs leading-sds-caps-xxs text-sds-gray-500 uppercase font-semibold">
            <I18n i18nKey="moreInfoComingSoon" />
          </p>
        </div>
        <div className="flex flex-col gap-sds-xl min-h-[270px] pb-sds-xxl">
          <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold">
            {t('tutorials')}
          </h2>
          <p className="text-sds-body-s leading-sds-body-s">
            {t('tutorialsSectionContent')}
          </p>
          <p className="text-sds-caps-xxs leading-sds-caps-xxs text-sds-gray-500 uppercase font-semibold">
            <I18n i18nKey="comingFall2024" />
          </p>
        </div>
      </Section>
      {/* TODO: Contact Banner */}
    </div>
  )
}
