import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import { ComponentProps } from 'react'

import {
  previousBrowseDatasetParamsAtom,
  previousDepositionIdAtom,
  previousSingleDatasetParamsAtom,
  previousSingleDepositionParamsAtom,
} from 'app/state/filterHistory'
import { AtomTupleWithValue } from 'app/types/state'

import { Breadcrumbs } from './Breadcrumbs'
import { HydrateAtomsProvider } from './HydrateAtomsProvider'

const BREADCRUMB_DATA = {
  id: 10,
  title: 'Title',
}

type BreadcrumbsProp = ComponentProps<typeof Breadcrumbs>

function renderBreadcrumbs({
  previousBrowseDatasetParams,
  previousDepositionId,
  previousSingleDatasetParams,
  previousSingleDepositionParams,
  variant,
}: {
  previousBrowseDatasetParams?: string
  previousDepositionId?: number
  previousSingleDatasetParams?: string
  previousSingleDepositionParams?: string
  variant: BreadcrumbsProp['variant']
}) {
  function BreadcrumbWrapper() {
    const initialValues: AtomTupleWithValue[] = []

    if (previousBrowseDatasetParams) {
      initialValues.push([
        previousBrowseDatasetParamsAtom,
        previousBrowseDatasetParams,
      ])
    }

    if (previousDepositionId) {
      initialValues.push([previousDepositionIdAtom, previousDepositionId])
    }

    if (previousSingleDatasetParams) {
      initialValues.push([
        previousSingleDatasetParamsAtom,
        previousSingleDatasetParams,
      ])
    }

    if (previousSingleDepositionParams) {
      initialValues.push([
        previousSingleDepositionParamsAtom,
        previousSingleDepositionParams,
      ])
    }

    return (
      <HydrateAtomsProvider initialValues={initialValues}>
        <Breadcrumbs variant={variant} data={BREADCRUMB_DATA} />
      </HydrateAtomsProvider>
    )
  }

  const BreadcrumbsStub = createRemixStub([
    {
      path: '/',
      Component: BreadcrumbWrapper,
    },
  ])

  render(<BreadcrumbsStub />)
}

const BROWSE_DATASETS_URL = '/browse-data/datasets'
const BROWSE_DEPOSITIONS_URL = '/browse-data/depositions'
const SINGLE_DATASET_URL = `/datasets/${BREADCRUMB_DATA.id}`
const SINGLE_DATASET_TITLE = `dataset: ${BREADCRUMB_DATA.title}`

function testReturnToDepositionLink() {
  it('should show return to deposition link', () => {
    const params = 'object=foo'
    const id = 10

    renderBreadcrumbs({
      variant: 'dataset',
      previousDepositionId: id,
      previousSingleDepositionParams: params,
    })

    expect(
      screen.queryByRole('link', { name: 'returnToDeposition' }),
    ).toHaveAttribute('href', `/depositions/${id}?${params}`)
  })
}

describe('<Breadcrumbs />', () => {
  describe('variant=dataset', () => {
    it('should render browse all datasets link', () => {
      renderBreadcrumbs({ variant: 'dataset' })

      expect(
        screen.queryByRole('link', { name: 'allDatasets' }),
      ).toHaveAttribute('href', BROWSE_DATASETS_URL)
    })

    it('should render dataset breadcrumb', () => {
      renderBreadcrumbs({ variant: 'dataset' })

      expect(screen.queryByText('dataset')).toBeVisible()
    })

    it('should carry over query params', () => {
      const params = 'object=foo'

      renderBreadcrumbs({
        variant: 'dataset',
        previousBrowseDatasetParams: params,
      })

      expect(
        screen.queryByRole('link', { name: 'allDatasets' }),
      ).toHaveAttribute('href', `${BROWSE_DATASETS_URL}?${params}`)
    })

    testReturnToDepositionLink()
  })

  describe('variant=run', () => {
    it('should render browse all datasets link', () => {
      renderBreadcrumbs({ variant: 'run' })

      expect(
        screen.queryByRole('link', { name: 'allDatasets' }),
      ).toHaveAttribute('href', BROWSE_DATASETS_URL)
    })

    it('should render run breadcrumb', () => {
      renderBreadcrumbs({ variant: 'run' })

      expect(screen.queryByText('run')).toBeVisible()
    })

    it('should render dataset link', () => {
      renderBreadcrumbs({ variant: 'run' })

      expect(
        screen.queryByRole('link', {
          name: SINGLE_DATASET_TITLE,
        }),
      ).toHaveAttribute('href', SINGLE_DATASET_URL)
    })

    it('should carry over query params', () => {
      const previousBrowseDatasetParams = 'object=foo'
      const previousSingleDatasetParams = 'tilt_min=90'

      renderBreadcrumbs({
        variant: 'run',
        previousBrowseDatasetParams,
        previousSingleDatasetParams,
      })

      expect(
        screen.queryByRole('link', { name: 'allDatasets' }),
      ).toHaveAttribute(
        'href',
        `${BROWSE_DATASETS_URL}?${previousBrowseDatasetParams}`,
      )

      expect(
        screen.queryByRole('link', {
          name: SINGLE_DATASET_TITLE,
        }),
      ).toHaveAttribute(
        'href',
        `${SINGLE_DATASET_URL}?${previousSingleDatasetParams}`,
      )
    })

    testReturnToDepositionLink()
  })

  describe('variant=deposition', () => {
    it('should render browse all depositions link', () => {
      renderBreadcrumbs({ variant: 'deposition' })

      expect(
        screen.queryByRole('link', { name: 'allDepositions' }),
      ).toHaveAttribute('href', BROWSE_DEPOSITIONS_URL)
    })

    it('should render deposition breadcrumb', () => {
      renderBreadcrumbs({ variant: 'deposition' })

      expect(screen.queryByText('deposition')).toBeVisible()
    })
  })
})
