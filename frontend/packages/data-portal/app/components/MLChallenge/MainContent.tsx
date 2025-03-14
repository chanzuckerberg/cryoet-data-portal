import { Button } from '@czi-sds/components'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ReactNode } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { I18n } from 'app/components/I18n'
import { SpeechBubbleIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import styles from 'app/components/MDX/MdxBody.module.css'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { MLChallengeSectionId } from './constants'
import {
  BookIcon,
  GlobeIcon,
  MdxContributorList,
  MdxIconGrid,
  MdxLink,
  MdxPrizeTable,
  MdxSeeLeaderboard,
  MdxTable,
  MdxToggleShowMore,
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
        color === 'primary100' &&
          'after:bg-light-sds-color-primitive-blue-100 ',
        color === 'primary200' &&
          'after:bg-light-sds-color-primitive-blue-200 ',
        color === 'gray100' && 'after:bg-light-sds-color-primitive-gray-100 ',
        color === 'gray500' && 'after:bg-light-sds-color-primitive-gray-500 ',
        useMdxStyles && styles.body,
        className,
      )}
    >
      {children}
    </div>
  )
}

export function MainContent() {
  const {
    aboutTheCompetition,
    glossary,
    howToParticipate,
    whatIsCryoET,
    competitionContributors,
  } = useTypedLoaderData<{
    aboutTheCompetition: MDXRemoteSerializeResult
    glossary: MDXRemoteSerializeResult
    howToParticipate: MDXRemoteSerializeResult
    whatIsCryoET: MDXRemoteSerializeResult
    competitionContributors: MDXRemoteSerializeResult
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
            'bg-light-sds-color-primitive-gray-50 border border-light-sds-color-primitive-gray-200 rounded-sds-m shadow-sds-l',
          )}
        >
          <div>
            <p className="text-sds-caps-xxxs leading-sds-caps-xxxs tracking-sds-caps-xxxs font-semibold uppercase text-light-sds-color-primitive-gray-500 mb-sds-xs">
              {t('competitionDepositionName')}:
            </p>
            <p className="text-sds-header-m leading-sds-header-m font-semibold mb-sds-l">
              {t('competitionDataHeader')}
            </p>
            <p className="text-sds-body-s leading-sds-body-s mb-sds-l text-justify">
              {t('competitionDataDetails')}
            </p>
            <div className="flex gap-sds-default">
              <Link to="/depositions/10310" newTab>
                <Button sdsStyle="rounded" sdsType="primary">
                  {t('exploreInPortal')}
                </Button>
              </Link>

              <Link to="https://www.kaggle.com/competitions/czii-cryo-et-object-identification/">
                <Button sdsStyle="rounded" sdsType="secondary">
                  {t('viewOnKaggle')}
                </Button>
              </Link>
            </div>
          </div>
          <img
            src="/images/ml-challenge-competition-data-preview.png"
            alt="Deposition Preview"
            className="rounded-sds-m"
          />
        </div>
        <p className="font-semibold">
          <I18n i18nKey="competitionDataSubnote" />
        </p>
      </Section>

      <JumpToAnchor id={MLChallengeSectionId.WhatIsCryoET} />
      <Section useMdxStyles>
        <MDXRemote
          {...whatIsCryoET}
          components={{
            ...COMMON_MDX_COMPONENTS,
            ToggleShowMore: MdxToggleShowMore,
          }}
        />
      </Section>

      <JumpToAnchor id={MLChallengeSectionId.CompetitionContributors} />
      <Section color="gray100" className="gap-sds-xl">
        <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold">
          {t('competitionContributors')}
        </h2>
        <p className="text-sds-body-s leading-sds-body-s">
          {t('competitionContributorsBlurb')}
        </p>
        <MDXRemote
          {...competitionContributors}
          components={{ ContributorList: MdxContributorList }}
        />
        <div className="flex flex-col items-center mt-sds-l">
          <div className="w-full h-[2px] bg-light-sds-color-primitive-gray-200 mb-sds-xxl" />
          <p className="text-sds-caps-xxs leading-sds-caps-xxs uppercase font-semibold text-light-sds-color-primitive-gray-500 mb-sds-l">
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
      <Section className="min-h-[270px]" useMdxStyles>
        <MDXRemote
          {...glossary}
          components={{
            ...COMMON_MDX_COMPONENTS,
            ToggleShowMore: MdxToggleShowMore,
          }}
        />
      </Section>

      <JumpToAnchor id={MLChallengeSectionId.Contact} />
      <Section
        className="font-semibold py-[80px] screen-716:py-[50px]"
        color="primary100"
      >
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
