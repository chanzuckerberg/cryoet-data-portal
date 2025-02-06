import { Button } from '@czi-sds/components'

import { AuthorList } from 'app/components/AuthorList'
import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

export type Winner = {
  image?: string
  name: string
  score: number
}

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
  const authors = [
    {
      correspondingAuthorStatus: null,
      email: null,
      name: 'Willy W. Sun',
      orcid: null,
      primaryAuthorStatus: true,
      __typename: 'DatasetAuthor',
    },
    {
      correspondingAuthorStatus: null,
      email: null,
      name: 'Dennis J Michalak',
      orcid: null,
      primaryAuthorStatus: true,
      __typename: 'DatasetAuthor',
    },
    {
      correspondingAuthorStatus: true,
      email: null,
      name: 'Kem A. Sochacki',
      orcid: '0000-0003-1160-4558',
      primaryAuthorStatus: true,
      __typename: 'DatasetAuthor',
    },
    {
      correspondingAuthorStatus: true,
      email: null,
      name: 'Jenny E. Hinshaw',
      orcid: '0000-0002-5130-5061',
      primaryAuthorStatus: false,
      __typename: 'DatasetAuthor',
    },
    {
      correspondingAuthorStatus: true,
      email: null,
      name: 'Justin W. Taraska',
      orcid: '0000-0001-5355-9535',
      primaryAuthorStatus: false,
      __typename: 'DatasetAuthor',
    },
  ]
  return (
    <div
      className={cns(
        'py-sds-l px-sds-xl border-t-[8px] border-t-sds-color-semantic-component-accent-icon',
        'bg-white shadow-card',
        'flex flex-col screen-667:flex-row screen-1345:flex-col gap-sds-s',
      )}
    >
      {place <= 3 && (
        <div className="winner-image bg-cover bg-no-repeat bg-center bg-[url('https://files.cryoetdataportal.cziscience.com/depositions_metadata/10314/Images/snapshot.png')] w-full h-inherit min-h-[232px]" />
      )}
      <div>
        <div className="flex justify-between mt-sds-l">
          <h3 className="text-sds-header-xl leading-sds-header-xl font-semibold">
            {place}
            {getNumberSuffix(place)} Place
          </h3>
          <p className="text-sds-body-m leading-sds-body-m">Score: 90.00</p>
        </div>
        <h4 className="text-sds-body-m leading-sds-body-m font-semibold mt-sds-s">
          {winner.name}
        </h4>
        <h5 className="text-sds-color-primitive-gray-600 mt-sds-xs">
          Members: <AuthorList authors={authors} subtle />
        </h5>
        {place <= 3 && (
          <p className="mt-sds-s">
            Experimental and simulated training data for the CryoET Object
            Identification Challenge. Each dataset contains tilt series,
            alignments, tomograms and ground truth annotations for six protein
            complexes...
          </p>
        )}
        <div className="flex flex-col screen-360:flex-row gap-sds-m screen-360:gap-sds-l justify-stretch screen-360:justify-end mt-sds-l">
          <Link to="https://www.kaggle.com/competitions/czii-cryo-et-object-identification/">
            <Button
              sdsStyle="rounded"
              sdsType="secondary"
              className="w-full screen-360:w-initial"
            >
              {t('viewModel')}
            </Button>
          </Link>
          <Link to="https://www.kaggle.com/competitions/czii-cryo-et-object-identification/">
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
