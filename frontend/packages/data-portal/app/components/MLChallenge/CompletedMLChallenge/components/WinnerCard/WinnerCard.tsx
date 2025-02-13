import { Button } from '@czi-sds/components'

import { GetWinningDepositionsDataQuery } from 'app/__generated_v2__/graphql'
import { AuthorList } from 'app/components/AuthorList'
import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

export type Winner = GetWinningDepositionsDataQuery['depositions'][0]

const getNumberSuffix = (place: number) => {
  switch (place) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}

export function WinnerCard({
  winner,
  place,
}: {
  winner: Winner
  place: number
}) {
  const { t } = useI18n()
  return (
    <div
      className={cns(
        'py-sds-l px-sds-xl',
        'bg-white shadow-card',
        'grid grid-cols-1 gap-sds-s',
        place <= 3
          ? 'border-t-[8px] border-t-sds-color-semantic-component-accent-icon'
          : 'border-b-[8px] border-b-sds-color-semantic-component-accent-icon',
        place <= 3 &&
          'grid-rows-[4fr_5fr] screen-667:grid-cols-[1fr_2fr] screen-667:grid-rows-1 screen-1345:grid-cols-1 screen-1345:grid-rows-[232px_1fr]',
      )}
    >
      {place <= 3 && (
        <div
          style={{
            backgroundImage: `url(${winner.keyPhotoThumbnailUrl ?? ''})`,
          }}
          className="winner-image bg-cover bg-no-repeat bg-center w-full screen-1345:h-[232px]"
        />
      )}
      <div className="grow flex flex-col">
        <div className="flex justify-between mt-sds-l">
          <h3 className="text-sds-header-xl leading-sds-header-xl font-semibold">
            {place}
            {getNumberSuffix(place)} Place
          </h3>
          {/* // TODO(smccanny): Add the score to the winner card */}
          <p className="text-sds-body-m leading-sds-body-m">Score: 90.00</p>
        </div>
        <h4 className="text-sds-body-m leading-sds-body-m font-semibold mt-sds-s">
          {winner.title}
        </h4>
        <h5 className="text-sds-color-primitive-gray-600 mt-sds-xs">
          Members:{' '}
          <AuthorList
            authors={winner.authors.edges.map((author) => author.node)}
            subtle
          />
        </h5>
        {place <= 3 && (
          <p className="mt-sds-s line-clamp-5">{winner.description}</p>
        )}
        <div className="grow flex flex-col items-end screen-360:flex-row gap-sds-m screen-360:gap-sds-l justify-stretch screen-360:justify-end mt-sds-l">
          <Link to={`/depositions/${winner.id}`}>
            <Button
              sdsStyle="rounded"
              sdsType="primary"
              className="w-full screen-360:w-initial"
            >
              {t('viewDeposition')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
