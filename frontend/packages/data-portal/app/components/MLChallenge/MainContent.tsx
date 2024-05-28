import { Icon } from '@czi-sds/components'
import { ReactNode } from 'react'

import { I18n } from 'app/components/I18n'
import { FolderIcon, RocketIcon, SpeechBubbleIcon } from 'app/components/icons'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { MLChallengeSectionId } from './constants'

/**
 * Used for scrolling to a specific section in the page
 */
function JumpToAnchor({
  className,
  id,
}: {
  className?: string
  id: MLChallengeSectionId
}) {
  // Translate div up a bit to account for space between header and the nav bar.
  // We use translate so we don't affect the layout.
  return <div id={id} className={cns('-translate-y-6', className)} />
}

function Section({
  children,
  className,
  color,
}: {
  children: ReactNode
  className?: string
  color?: 'primary100' | 'primary200' | 'gray100' | 'gray500'
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

function Headshot({
  name,
  organization,
  filePath,
}: {
  name: string
  organization: string
  filePath: string
}) {
  const { t } = useI18n()

  return (
    <div
      className={cns(
        'flex flex-col items-center text-center min-w-[150px] min-h-[150px] col-span-1',
        // https://css-irl.info/controlling-leftover-grid-items/
        'last:[&:nth-child(3n-2)]:col-span-3 screen-1024:last:[&:nth-child(3n-2)]:col-span-1',
        'screen-1024:last:[&:nth-child(4n-2)]:col-start-3',
        'screen-1024:[&:nth-last-child(2)]:[&:nth-child(4n-3)]:col-start-2',
      )}
    >
      <img
        className="w-[150px] h-[150px]"
        alt={t('headshotOfName', { name })}
        src={`images/headshots/${filePath}.png`}
      />
      <p className="text-sds-header-m leading-sds-header-m font-semibold mt-sds-l">
        {name}
      </p>
      <p className="text-sds-body-xxs leading-sds-body-xxs mt-sds-xs">
        {organization}
      </p>
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
      <JumpToAnchor id={MLChallengeSectionId.About} />

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
        <JumpToAnchor id={MLChallengeSectionId.CompetitionDetails} />
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

      <JumpToAnchor id={MLChallengeSectionId.HowToParticipate} />
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
            <ul className="mb-sds-xl gap-sds-xs list-disc ml-[17px] flex flex-col">
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
            <RocketIcon className="w-sds-icon-xl h-sds-icon-xl inline-block text-sds-primary-400" />
            <h3 className="text-sds-header-m leading-sds-header-m font-semibold">
              {t('gettingStarted')}
            </h3>
          </div>
          <div className="ml-[42px] mb-sds-xxl text-sds-body-s leading-sds-body-s flex flex-col">
            <p className="mb-sds-m">
              <I18n i18nKey="gettingStartedDescription" />
            </p>
            <ul className="mb-sds-xl gap-sds-xs list-disc ml-[17px] flex flex-col">
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

      <JumpToAnchor id={MLChallengeSectionId.CompetitionData} />
      <Section color="primary200" className="gap-sds-xl">
        <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold">
          {t('competitionData')}
        </h2>
        <div className="p-sds-xxl bg-sds-gray-white border border-sds-gray-200 rounded-sds-m shadow-sds-l flex flex-row gap-sds-xxl justify-between">
          <div>
            <p className="text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold uppercase text-sds-gray-500 mb-sds-xs">
              {t('competitionDataset')}:
            </p>
            <p className="text-sds-header-m leading-sds-header-m font-semibold mb-sds-l">
              {t('comingFall2024')}
            </p>
            <p className="text-sds-body-s leading-sds-body-s mb-sds-l">
              {t('competitionDataDetails1')}
            </p>
            <p>
              <I18n i18nKey="competitionDataDetails2" />
            </p>
          </div>
          <FolderIcon className="text-sds-gray-300 min-w-[150px] min-h-[150px]" />
        </div>
      </Section>

      <Section className="!p-0">
        <JumpToAnchor id={MLChallengeSectionId.AboutCryoETData} />
        <div className="flex flex-col gap-sds-xl min-h-[270px] py-sds-xxl">
          <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold">
            {t('aboutCryoEtData')}
          </h2>
          <p className="text-sds-caps-xxs leading-sds-caps-xxs text-sds-gray-500 uppercase font-semibold">
            <I18n i18nKey="moreInfoComingSoon" />
          </p>
        </div>

        <JumpToAnchor
          // For some odd reason, the tutorials section needs to be translated higher up lol
          className="-translate-y-16"
          id={MLChallengeSectionId.Tutorials}
        />
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

      <JumpToAnchor id={MLChallengeSectionId.Organizers} />
      <Section color="gray100">
        <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold mb-sds-xl">
          {t('aboutTheOrganizers')}
        </h2>
        <div className="grid grid-cols-3 screen-1024:grid-cols-4 gap-sds-xxl justify-center mb-sds-xxl">
          <Headshot
            name="Bridget Carragher"
            organization={t('cziiOrganization')}
            filePath="Bridget-Carragher"
          />
          <Headshot
            name="Anchi Cheng"
            organization={t('cziiOrganization')}
            filePath="Anchi-Cheng"
          />
          <Headshot
            name="Utz Ermel"
            organization={t('cziiOrganization')}
            filePath="Utz-Ermel"
          />
          <Headshot
            name="Kyle Harrington"
            organization={t('cziiOrganization')}
            filePath="Kyle-Harrington"
          />
          <Headshot
            name="Reza Paraan"
            organization={t('cziiOrganization')}
            filePath="Reza-Paraan"
          />
          <Headshot
            name="Jonathan Schwartz"
            organization={t('cziiOrganization')}
            filePath="Jonathan-Schwartz"
          />
          <Headshot
            name="Daniel Serwas"
            organization={t('cziiOrganization')}
            filePath="Daniel-Serwas"
          />
          <Headshot
            name="Hannah Siems"
            organization={t('cziiOrganization')}
            filePath="Hannah-Siems"
          />
          <Headshot
            name="Yue Yu"
            organization={t('cziiOrganization')}
            filePath="Yue-Yu"
          />
          <Headshot
            name="Kevin Zhao"
            organization={t('cziiOrganization')}
            filePath="Kevin-Zhao"
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-[2px] bg-sds-gray-200 mb-sds-xxl" />
          <p className="text-sds-caps-xxs leading-sds-caps-xxs uppercase font-semibold text-sds-gray-500 mb-sds-l">
            {t('sponsoredBy')}:
          </p>
          <div className="flex flex-col screen-1024:flex-row gap-sds-xl items-center w-full justify-between">
            <div className="w-[371px] flex justify-center">
              <img
                src="images/czii-logo.png"
                alt="Chan Zuckerberg Imaging Institute Logo"
              />
            </div>
            <div>
              <img
                src="images/imaging-program-logo.png"
                alt="Chan Zuckerberg Imaging Program Logo"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* TODO FAQ section */}

      <JumpToAnchor id={MLChallengeSectionId.Contact} />
      <Section className="font-semibold py-[50px]" color="primary100">
        <h2 className="text-sds-header-xl leading-sds-header-xl">
          {t('contact')}
        </h2>

        <div className="flex justify-center gap-sds-xxl">
          <div>
            <h2 className="text-sds-header-xl leading-sds-header-xl">
              {t('contact')}
            </h2>

            <p className="text-sds-body-m leading-sds-body-m mt-sds-xl">
              <I18n i18nKey="haveMoreQuestions" />
            </p>
          </div>

          <SpeechBubbleIcon
            className="flex-shrink-0"
            color="#a9bdfc"
            width={150}
          />
        </div>
      </Section>
    </div>
  )
}
