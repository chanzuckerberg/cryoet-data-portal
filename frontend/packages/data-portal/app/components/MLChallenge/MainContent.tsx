import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ReactNode } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { I18n } from 'app/components/I18n'
import { FolderIcon, SpeechBubbleIcon } from 'app/components/icons'
import styles from 'app/components/MDX/MdxBody.module.css'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { MLChallengeSectionId } from './constants'
import {
  BookIcon,
  GlobeIcon,
  MdxIconGrid,
  MdxLink,
  MdxPrizeTable,
  MdxSeeLeaderboard,
  MdxTable,
  RocketIcon,
  UpdateIcon,
} from './MdxComponents'

const COMMON_MDX_COMPONENTS = {
  a: MdxLink,
  Table: MdxTable,
  IconGrid: MdxIconGrid,
}

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
  return <div id={id} className={cns('-translate-y-sds-xxl', className)} />
}

function Section({
  children,
  className,
  color,
  useMdxStyles,
}: {
  children: ReactNode
  className?: string
  color?: 'primary100' | 'primary200' | 'gray100' | 'gray500'
  useMdxStyles?: boolean
}) {
  return (
    <div
      className={cns(
        'py-sds-xl screen-716:py-sds-xxl flex flex-col',
        color &&
          'relative after:h-full after:w-[200vw] after:absolute after:top-0 after:-translate-x-1/2 after:-z-10',
        color === 'primary100' && 'after:bg-sds-color-primitive-blue-100 ',
        color === 'primary200' && 'after:bg-sds-color-primitive-blue-200 ',
        color === 'gray100' && 'after:bg-sds-color-primitive-gray-100 ',
        color === 'gray500' && 'after:bg-sds-color-primitive-gray-500 ',
        useMdxStyles && styles.body,
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
        'screen-716:last:[&:nth-child(3n-2)]:col-span-3 screen-1024:last:[&:nth-child(3n-2)]:col-span-1',
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
  const { aboutTheCompetition, glossary, howToParticipate, whatIsCryoET } =
    useTypedLoaderData<{
      aboutTheCompetition: MDXRemoteSerializeResult
      glossary: MDXRemoteSerializeResult
      howToParticipate: MDXRemoteSerializeResult
      whatIsCryoET: MDXRemoteSerializeResult
    }>()

  const { t } = useI18n()

  return (
    <div className="flex flex-col max-w-content-small">
      <JumpToAnchor id={MLChallengeSectionId.About} />

      <Section useMdxStyles>
        <MDXRemote
          {...aboutTheCompetition}
          components={{
            ...COMMON_MDX_COMPONENTS,
            PrizeTable: MdxPrizeTable,
            SeeLeaderboard: MdxSeeLeaderboard,
          }}
        />
      </Section>

      <JumpToAnchor id={MLChallengeSectionId.HowToParticipate} />
      <Section color="primary100" className="min-h-[270px]" useMdxStyles>
        <MDXRemote
          {...howToParticipate}
          components={{
            ...COMMON_MDX_COMPONENTS,
            BookIcon,
            GlobeIcon,
            RocketIcon,
            UpdateIcon,
          }}
        />
      </Section>

      <JumpToAnchor id={MLChallengeSectionId.CompetitionData} />
      <Section color="primary200" className="gap-sds-xl">
        <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold">
          {t('competitionData')}
        </h2>
        <div
          className={cns(
            'p-sds-xl screen-716:p-sds-xxl',
            'flex flex-col-reverse screen-716:flex-row gap-sds-xl screen-716:gap-sds-xxl justify-between items-center',
            'bg-sds-color-primitive-common-white border border-sds-color-primitive-gray-200 rounded-sds-m shadow-sds-l',
          )}
        >
          <div>
            <p className="text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold uppercase text-sds-color-primitive-gray-500 mb-sds-xs">
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
          <FolderIcon className="text-sds-color-primitive-gray-300 min-w-[150px] min-h-[150px]" />
        </div>
      </Section>

      <JumpToAnchor id={MLChallengeSectionId.WhatIsCryoET} />
      <Section useMdxStyles>
        <MDXRemote
          {...whatIsCryoET}
          components={{
            ...COMMON_MDX_COMPONENTS,
          }}
        />
      </Section>

      <JumpToAnchor id={MLChallengeSectionId.CompetitionContributors} />
      <Section color="gray100">
        <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold mb-sds-xl">
          {t('aboutTheOrganizers')}
        </h2>
        <div className="grid grid-cols-2 screen-716:grid-cols-3 screen-1024:grid-cols-4 gap-sds-xxl justify-center mb-sds-xxl">
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
          <div className="w-full h-[2px] bg-sds-color-primitive-gray-200 mb-sds-xxl" />
          <p className="text-sds-caps-xxs leading-sds-caps-xxs uppercase font-semibold text-sds-color-primitive-gray-500 mb-sds-l">
            {t('sponsoredBy')}:
          </p>
          <div className="flex flex-col screen-1024:flex-row gap-sds-xl items-center w-full max-w-[350px] screen-1024:max-w-none justify-between">
            <div className="flex justify-center">
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

      <JumpToAnchor id={MLChallengeSectionId.Glossary} />
      <Section className="min-h-[270px]">
        <MDXRemote
          {...glossary}
          components={{
            ...COMMON_MDX_COMPONENTS,
          }}
        />
      </Section>

      <JumpToAnchor id={MLChallengeSectionId.Contact} />
      <Section className="font-semibold py-[50px]" color="primary100">
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
            className="flex-shrink-0 hidden screen-716:block"
            color="#a9bdfc"
            width={150}
          />
        </div>
      </Section>
    </div>
  )
}
