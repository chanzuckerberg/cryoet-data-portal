import { Button } from '@czi-sds/components'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ReactNode } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetWinningDepositionsDataQuery } from 'app/__generated_v2__/graphql'
import { I18n } from 'app/components/I18n'
import { Link } from 'app/components/Link'
import styles from 'app/components/MDX/MdxBody.module.css'
import { TopThreeWinners } from 'app/components/MLChallenge/CompletedMLChallenge/components/TopThreeWinners/TopThreeWinners'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import {
  MdxContributorList,
  MdxIconGrid,
  MdxLink,
  MdxPrizeTable,
  MdxSeeLeaderboard,
  MdxTable,
  MdxToggleShowMore,
} from '../../../MdxComponents'
import { CompletedMLChallengeSectionId } from '../../constants'
import { OtherWinners } from '../OtherWinners/OtherWinners'

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
  id: CompletedMLChallengeSectionId
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

export function CompletedChallengeLayout() {
  const {
    aboutTheCompetitionCompleted,
    glossary,
    whatIsCryoET,
    competitionContributors,
    challengeResources,
    winningDepositions,
  } = useTypedLoaderData<{
    aboutTheCompetitionCompleted: MDXRemoteSerializeResult
    glossary: MDXRemoteSerializeResult
    whatIsCryoET: MDXRemoteSerializeResult
    competitionContributors: MDXRemoteSerializeResult
    challengeResources: MDXRemoteSerializeResult
    winningDepositions: GetWinningDepositionsDataQuery
  }>()

  const { t } = useI18n()

  return (
    <div className="flex flex-col max-w-full screen-1024:max-w-[800px] screen-1345:max-w-[1100px] mx-auto">
      <JumpToAnchor id={CompletedMLChallengeSectionId.Impact} />
      <Section color="primary100">
        <div className="flex flex-col screen-760:flex-row justify-between screen-760:items-center gap-sds-xl">
          <div className="screen-760:max-w-[500px] screen-1345:max-w-[56%]">
            <h2 className="text-[26px] screen-512:text-[34px] leading-[34px] tracking-[0.8px] screen-512:leading-[46px] font-semibold mb-sds-xxl mt-sds-xxl screen-512:mt-[0px] screen-512:tracking-[0.3px]">
              {t('impact')}
            </h2>
            <h3 className="screen-512:text-sds-header-xl screen-512:leading-sds-header-xl text-[18px] leading-[24px] font-semibold mt-sds-xxl">
              {t('impactSubTitle')}
            </h3>
            <p className="text-sds-body-m leading-sds-body-m text-[#6C6C6C] mt-sds-xl">
              <I18n i18nKey="impactExplanation" />
            </p>
            <p className="text-sds-body-m leading-sds-body-m text-[#6C6C6C] mt-sds-xl mb-sds-xxl">
              {t('impactCTAText')}
            </p>
            <div className="flex gap-sds-l mb-sds-xxl">
              <Link to="https://www.biorxiv.org/content/10.1101/2024.11.04.621686v2/">
                <Button sdsStyle="rounded" sdsType="primary">
                  {t('readPaper')}
                </Button>
              </Link>
              <Link to="https://airtable.com/apppmytRJXoXYTO9w/shr5UxgeQcUTSGyiY?prefill_Event=Portal&hide_Event=true">
                <Button sdsStyle="rounded" sdsType="secondary">
                  {t('contributeAnnotations')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-[113%] left-[-7%] screen-760:left-[26px] relative screen-1024:w-[400px]">
            <img
              className="w-full -mb-[16%] screen-1024:-mb-[43px] screen-1345:-mb-[63px]"
              src="/images/researchPaper.svg"
              alt="Bio Rxiv Paper Preview with the title 'Annotating CryoET Volumes: A Machine Learning Challenge'"
            />
          </div>
        </div>
      </Section>

      <JumpToAnchor id={CompletedMLChallengeSectionId.Winners} />

      {winningDepositions.depositions.length > 0 && (
        <Section>
          <TopThreeWinners winners={winningDepositions.depositions} />
        </Section>
      )}
      {winningDepositions.depositions.length > 3 && (
        <Section color="primary100">
          <OtherWinners winners={winningDepositions.depositions} />
        </Section>
      )}

      <JumpToAnchor id={CompletedMLChallengeSectionId.About} />
      <Section useMdxStyles>
        <h2 className="[&&]:text-[26px] [&&]:screen-512:text-[34px] [&&]:leading-[34px] [&&]:tracking-[0.8px] [&&]:screen-512:leading-[46px] font-semibold [&&]:screen-512:tracking-[0.3px]">
          {t('competitionDetails')}
        </h2>
        <MDXRemote
          {...aboutTheCompetitionCompleted}
          components={{
            ...COMMON_MDX_COMPONENTS,
            PrizeTable: MdxPrizeTable,
            SeeLeaderboard: MdxSeeLeaderboard,
            ToggleShowMore: MdxToggleShowMore,
          }}
        />
      </Section>

      <JumpToAnchor id={CompletedMLChallengeSectionId.CompetitionData} />
      <Section color="primary100" className="gap-sds-xl" useMdxStyles>
        <h2 className="text-sds-header-xl leading-sds-header-xl font-semibold [&&]:mb-0">
          {t('competitionData')}
        </h2>
        <div
          className={cns(
            'p-sds-xl screen-716:p-sds-xxl',
            'flex flex-col-reverse screen-716:flex-row gap-sds-xl screen-716:gap-sds-xxl justify-between items-center',
            'bg-sds-color-primitive-common-white border border-sds-color-primitive-gray-200 rounded-sds-m shadow-card',
          )}
        >
          <div>
            <h4 className="text-sds-caps-xxxs leading-sds-caps-xxxs tracking-sds-caps-xxxs font-semibold uppercase text-sds-color-primitive-gray-500 mb-sds-xs">
              {t('competitionDepositionName')}:
            </h4>
            <h3 className="text-sds-header-m leading-sds-header-m font-semibold mb-sds-l [&&&]:mt-0">
              {t('competitionDataHeader')}
            </h3>
            <p className="text-sds-body-s leading-sds-body-s mb-sds-l text-justify">
              {t('competitionDataDetailsPast')}
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
        <div className="w-full h-sds-xxxs bg-sds-color-primitive-gray-200" />
        <div className="mb-sds-xl">
          <MDXRemote
            {...challengeResources}
            components={{
              ...COMMON_MDX_COMPONENTS,
            }}
          />
        </div>
      </Section>

      <JumpToAnchor id={CompletedMLChallengeSectionId.WhatIsCryoET} />
      <Section useMdxStyles>
        <MDXRemote
          {...whatIsCryoET}
          components={{
            ...COMMON_MDX_COMPONENTS,
            ToggleShowMore: MdxToggleShowMore,
          }}
        />
      </Section>

      <JumpToAnchor id={CompletedMLChallengeSectionId.Glossary} />
      <Section color="gray100" className="min-h-[270px]" useMdxStyles>
        <MDXRemote
          {...glossary}
          components={{
            ...COMMON_MDX_COMPONENTS,
            ToggleShowMore: MdxToggleShowMore,
          }}
        />
      </Section>

      <JumpToAnchor
        id={CompletedMLChallengeSectionId.CompetitionContributors}
      />
      <Section className="gap-sds-xl">
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
    </div>
  )
}
